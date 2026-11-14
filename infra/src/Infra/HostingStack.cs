using Amazon.CDK;
using Amazon.CDK.AWS.CertificateManager;
using Amazon.CDK.AWS.CloudFront;
using Amazon.CDK.AWS.CloudFront.Origins;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3;
using Constructs;
using System.Collections.Generic;

namespace YesYogaOne.Infra;

public class HostingStackProps : StackProps
{
    public ICertificate? Certificate { get; init; }
    public string[]? DomainNames { get; init; }
}

/// <summary>
/// Private S3 bucket fronted by CloudFront with Origin Access Control.
/// A CloudFront Function rewrites directory URLs (/faq/ or /faq) to
/// /faq/index.html so the prerendered pages resolve without a server, and
/// asks for a password (HTTP Basic auth) on the archived classic site under
/// /archive/. The gate is a courtesy curtain, not hard security: it keeps
/// casual visitors and search engines off the old pages.
/// </summary>
public class HostingStack : Stack
{
    public HostingStack(Construct scope, string id, HostingStackProps props) : base(scope, id, props)
    {
        var siteBucket = new Bucket(this, "SiteBucket", new BucketProps
        {
            BlockPublicAccess = BlockPublicAccess.BLOCK_ALL,
            Encryption = BucketEncryption.S3_MANAGED,
            EnforceSSL = true,
            RemovalPolicy = RemovalPolicy.RETAIN,
        });

        // The /archive/ password is supplied at deploy time, never committed
        // (this repo is public): ARCHIVE_PASSWORD env var, or
        // `cdk deploy -c archivePassword=...`. Only its SHA-256 reaches AWS.
        var archivePassword = Node.TryGetContext("archivePassword") as string
            ?? System.Environment.GetEnvironmentVariable("ARCHIVE_PASSWORD");
        if (string.IsNullOrEmpty(archivePassword))
        {
            throw new System.InvalidOperationException(
                "Set ARCHIVE_PASSWORD (or pass -c archivePassword=...) — the /archive/ password is needed to synth the hosting stack.");
        }
        var archivePasswordSha256 = System.Convert.ToHexString(
            System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(archivePassword)))
            .ToLowerInvariant();

        var viewerRequest = new Function(this, "IndexRewrite", new FunctionProps
        {
            Runtime = FunctionRuntime.JS_2_0,
            Code = FunctionCode.FromInline($$"""
                var crypto = require('crypto');
                var ARCHIVE_PASSWORD_SHA256 = '{{archivePasswordSha256}}';

                // The old WordPress site had these as separate pages; on the
                // redesign they are sections of the home page.
                var MOVED = {
                    '/faq': '/#faq',
                    '/testimonials': '/#testimonials'
                };

                function handler(event) {
                    var request = event.request;
                    var uri = request.uri;

                    var trimmed = uri.length > 1 && uri.endsWith('/') ? uri.slice(0, -1) : uri;
                    if (MOVED[trimmed]) {
                        return {
                            statusCode: 301,
                            statusDescription: 'Moved Permanently',
                            headers: { 'location': { value: MOVED[trimmed] } }
                        };
                    }

                    // The archived classic site sits behind a browser password prompt.
                    if ((uri === '/archive' || uri.startsWith('/archive/')) && !archiveAuthorized(request)) {
                        return {
                            statusCode: 401,
                            statusDescription: 'Unauthorized',
                            headers: {
                                'www-authenticate': { value: 'Basic realm="Yes Yoga One archive"' },
                                'cache-control': { value: 'no-store' }
                            }
                        };
                    }

                    if (uri.endsWith('/')) {
                        request.uri = uri + 'index.html';
                    } else if (!uri.includes('.')) {
                        request.uri = uri + '/index.html';
                    }
                    return request;
                }

                // HTTP Basic auth: any user name, the password has to match.
                function archiveAuthorized(request) {
                    var header = request.headers.authorization;
                    if (!header || !header.value.startsWith('Basic ')) {
                        return false;
                    }
                    var decoded;
                    try {
                        decoded = Buffer.from(header.value.slice(6), 'base64').toString('utf8');
                    } catch (e) {
                        return false;
                    }
                    var colon = decoded.indexOf(':');
                    if (colon < 0) {
                        return false;
                    }
                    var password = decoded.slice(colon + 1);
                    return crypto.createHash('sha256').update(password).digest('hex') === ARCHIVE_PASSWORD_SHA256;
                }
                """),
        });

        var distribution = new Distribution(this, "SiteDistribution", new DistributionProps
        {
            DefaultBehavior = new BehaviorOptions
            {
                Origin = S3BucketOrigin.WithOriginAccessControl(siteBucket),
                ViewerProtocolPolicy = ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                CachePolicy = CachePolicy.CACHING_OPTIMIZED,
                Compress = true,
                FunctionAssociations =
                [
                    new FunctionAssociation
                    {
                        Function = viewerRequest,
                        EventType = FunctionEventType.VIEWER_REQUEST,
                    },
                ],
            },
            DefaultRootObject = "index.html",
            ErrorResponses =
            [
                new ErrorResponse
                {
                    HttpStatus = 403,
                    ResponseHttpStatus = 404,
                    ResponsePagePath = "/index.html",
                    Ttl = Duration.Minutes(5),
                },
            ],
            Certificate = props.Certificate,
            DomainNames = props.DomainNames,
            PriceClass = PriceClass.PRICE_CLASS_100,
        });

        // GitHub Actions deploys via OIDC federation — no long-lived keys.
        // The role is only assumable from this repo's main branch.
        var githubOidc = new OpenIdConnectProvider(this, "GithubOidcProvider", new OpenIdConnectProviderProps
        {
            Url = "https://token.actions.githubusercontent.com",
            ClientIds = ["sts.amazonaws.com"],
        });

        var deployRole = new Role(this, "GithubDeployRole", new RoleProps
        {
            RoleName = "YesYogaOne-GithubDeploy",
            AssumedBy = new WebIdentityPrincipal(githubOidc.OpenIdConnectProviderArn, new Dictionary<string, object>
            {
                ["StringEquals"] = new Dictionary<string, string>
                {
                    ["token.actions.githubusercontent.com:aud"] = "sts.amazonaws.com",
                },
                // GitHub is migrating OIDC sub claims to an immutable-ID format
                // (owner@id/repo@id); accept both spellings, IDs pinned.
                ["StringLike"] = new Dictionary<string, object>
                {
                    ["token.actions.githubusercontent.com:sub"] = new[]
                    {
                        "repo:NormTheThird/sheilas-website:ref:refs/heads/main",
                        "repo:NormTheThird@5905828/sheilas-website@1375075332:ref:refs/heads/main",
                    },
                },
            }),
            Description = "Deploys the built site to S3 and invalidates CloudFront from GitHub Actions",
        });

        siteBucket.GrantReadWrite(deployRole);
        siteBucket.GrantDelete(deployRole);
        deployRole.AddToPolicy(new PolicyStatement(new PolicyStatementProps
        {
            Actions = ["cloudfront:CreateInvalidation"],
            Resources = [$"arn:aws:cloudfront::{Account}:distribution/{distribution.DistributionId}"],
        }));

        _ = new CfnOutput(this, "BucketName", new CfnOutputProps { Value = siteBucket.BucketName });
        _ = new CfnOutput(this, "DistributionId", new CfnOutputProps { Value = distribution.DistributionId });
        _ = new CfnOutput(this, "DistributionDomainName", new CfnOutputProps { Value = distribution.DistributionDomainName });
        _ = new CfnOutput(this, "DeployRoleArn", new CfnOutputProps { Value = deployRole.RoleArn });
    }
}

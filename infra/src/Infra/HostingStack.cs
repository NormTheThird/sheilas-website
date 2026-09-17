using Amazon.CDK;
using Amazon.CDK.AWS.CertificateManager;
using Amazon.CDK.AWS.CloudFront;
using Amazon.CDK.AWS.CloudFront.Origins;
using Amazon.CDK.AWS.S3;
using Constructs;

namespace YesYogaOne.Infra;

public class HostingStackProps : StackProps
{
    public ICertificate? Certificate { get; init; }
    public string[]? DomainNames { get; init; }
}

/// <summary>
/// Private S3 bucket fronted by CloudFront with Origin Access Control.
/// A CloudFront Function rewrites directory URLs (/faq/ or /faq) to
/// /faq/index.html so the prerendered pages resolve without a server.
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

        var indexRewrite = new Function(this, "IndexRewrite", new FunctionProps
        {
            Runtime = FunctionRuntime.JS_2_0,
            Code = FunctionCode.FromInline("""
                function handler(event) {
                    var request = event.request;
                    var uri = request.uri;
                    if (uri.endsWith('/')) {
                        request.uri = uri + 'index.html';
                    } else if (!uri.includes('.')) {
                        request.uri = uri + '/index.html';
                    }
                    return request;
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
                        Function = indexRewrite,
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

        _ = new CfnOutput(this, "BucketName", new CfnOutputProps { Value = siteBucket.BucketName });
        _ = new CfnOutput(this, "DistributionId", new CfnOutputProps { Value = distribution.DistributionId });
        _ = new CfnOutput(this, "DistributionDomainName", new CfnOutputProps { Value = distribution.DistributionDomainName });
    }
}

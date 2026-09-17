using Amazon.CDK;
using Amazon.CDK.AWS.CertificateManager;
using Constructs;

namespace YesYogaOne.Infra;

/// <summary>
/// ACM certificate for the custom domain (phase 5). Must live in us-east-1
/// for CloudFront. DNS stays at GoDaddy, so validation is manual: after
/// `cdk deploy`, copy the CNAME validation records from the ACM console into
/// GoDaddy DNS and wait for the cert to move to Issued.
/// </summary>
public class CertStack : Stack
{
    public ICertificate Certificate { get; }

    public CertStack(Construct scope, string id, IStackProps props) : base(scope, id, props)
    {
        var domainName = (string)Node.TryGetContext("domainName");
        var siteSubdomain = (string)Node.TryGetContext("siteSubdomain");

        Certificate = new Certificate(this, "SiteCertificate", new CertificateProps
        {
            DomainName = $"{siteSubdomain}.{domainName}",
            SubjectAlternativeNames = [domainName],
            Validation = CertificateValidation.FromDns(),
        });

        _ = new CfnOutput(this, "CertificateArn", new CfnOutputProps
        {
            Value = Certificate.CertificateArn,
        });
    }
}

using Amazon.CDK;
using YesYogaOne.Infra;

var app = new App();

// AWS account/region come from the CLI profile (CDK_DEFAULT_*) so the same
// code works for any account. CloudFront requires its ACM cert in us-east-1,
// and since there is no regional backend yet, everything is pinned there.
var account = System.Environment.GetEnvironmentVariable("CDK_DEFAULT_ACCOUNT");
var usEast1 = new Amazon.CDK.Environment { Account = account, Region = "us-east-1" };

// Phase 5: uncomment once ready to attach the custom domain.
// var certStack = new CertStack(app, "YesYogaOne-Cert", new StackProps { Env = usEast1 });

var hosting = new HostingStack(app, "YesYogaOne-Hosting", new HostingStackProps
{
    Env = usEast1,
    // Phase 5: Certificate = certStack.Certificate, DomainNames = ["www.yesyogaone.net", "yesyogaone.net"]
});

app.Synth();

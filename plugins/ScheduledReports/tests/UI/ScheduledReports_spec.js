/*!
 * Matomo - free/libre analytics platform
 *
 * UsersManager screenshot tests.
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("ScheduledReports", function () {
    this.timeout(0);
    this.fixture = "Piwik\\Plugins\\ScheduledReports\\tests\\Fixtures\\ReportSubscription";

    it("should show an error if no token was provided", async function () {
        await page.goto("?module=ScheduledReports&action=unsubscribe&token=");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('no_token');
    });

    it("should show an error if token is invalid", async function () {
        await page.goto("?module=ScheduledReports&action=unsubscribe&token=invalidtoken");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('invalid_token');
    });

    it("should ask for confirmation before unsubscribing", async function () {
        await page.goto("?module=ScheduledReports&action=unsubscribe&token=mycustomtoken4");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('unsubscribe_form');
    });

    it("should show success message on submit", async function () {
        await page.click(".submit");
        await page.waitForNetworkIdle();

        // Note that the same image is used by other test cases. This means that the "processed" screenshot will 
        // show the output of the last test that used this image - probably not THIS test!
        expect(await page.screenshot({ fullPage: true })).to.matchImage('unsubscribe_success');
    });

    it("token should be invalid on second try", async function () {
        await page.goto("?module=ScheduledReports&action=unsubscribe&token=mycustomtoken4");

        expect(await page.screenshot({ fullPage: true })).to.matchImage('invalid_token2');
    });

    it('should load the email reports page correctly', async function() {
        await page.goto("?module=ScheduledReports&action=index&idSite=1&period=year&date=2012-08-09");
        await page.evaluate(function () {
            $('#header').hide();
        });

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('email_reports');
    });

    it('should load the scheduled reports when Edit button is clicked', async function() {
        await page.click('.entityTable tr:nth-child(4) button[title="Edit"]');

        pageWrap = await page.$('.pageWrap');
        expect(await pageWrap.screenshot()).to.matchImage('email_reports_editor');
    });
});
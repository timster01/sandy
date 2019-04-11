using System;
using Xunit;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Firefox;   
using OpenQA.Selenium.Chrome;    
using OpenQA.Selenium.IE;

public class SeleniumTests : IDisposable
{
    private IWebDriver driver;

    public SeleniumTests()
    {
        string appURL = "https://sandylinux.azurewebsites.net";

        var options = new FirefoxOptions();
        options.SetPreference("webdriver.gecko.driver", Environment.GetEnvironmentVariable("GeckoWebDriver") + "geckodriver.exe");
        driver = new FirefoxDriver(options);
        driver.Navigate().GoToUrl(appURL);

        WebDriverWait wait = new WebDriverWait(driver, new TimeSpan(0, 0, 10));
        wait.Until(drvr => drvr.FindElements(By.ClassName("sandy_incoming_msg")).Count == 2);
    }

    [Fact]
    public void GreetingsTest()
    {
        string[] msgs = GetResponse("hoi");

        string expected = "Hallo!";
        string actual = msgs[0];
        Assert.Equal(expected, actual);

        UnknownQuestionTest();
    }

    [Fact]
    public void UnknownQuestionTest()
    {
        string[] msgs = GetResponse("Hoe heet ik?", 4);

        string expected = "Wil je een email adres opgeven?";
        string actual = msgs[3];
        Assert.Equal(expected, actual);
    }

    private string[] GetResponse(string message, int nExpectedResponseMsgs = 1)
    {
        int sandyMsgs = driver.FindElements(By.ClassName("sandy_incoming_msg")).Count;
        int totalMsgsExpected = sandyMsgs + nExpectedResponseMsgs;

        driver.FindElement(By.Id("messageInput")).SendKeys(message);
        driver.FindElement(By.Id("sendButton")).Click();

        WebDriverWait wait = new WebDriverWait(driver, new TimeSpan(0, 0, 10));
        wait.Until(drvr => drvr.FindElements(By.ClassName("sandy_incoming_msg")).Count >= totalMsgsExpected);

        // test if we received the expected amount of response messages
        int totalMsgs = driver.FindElements(By.ClassName("sandy_incoming_msg")).Count;
        Assert.Equal(totalMsgs, totalMsgsExpected);

        string[] responses = new string[nExpectedResponseMsgs];
        for (int i = 0; i < responses.Length; i++)
        {
            IWebElement rWE = driver.FindElements(By.ClassName("sandy_incoming_msg"))[sandyMsgs + i];
            responses[i] = rWE.FindElement(By.XPath("div[2]/div/p")).Text;
        }

        return responses;
    }

    public void Dispose()
    {
        driver.Quit();
    }
}
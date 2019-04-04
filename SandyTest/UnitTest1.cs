using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace SandyTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void Greetings()
        {
            // hier een dom testje
            Assert.AreEqual("hoi", "hallo");
        }
    }
}

//using System;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using OpenQA.Selenium;
//using OpenQA.Selenium.Firefox;
//using OpenQA.Selenium.Chrome;
//using OpenQA.Selenium.IE;
//using OpenQA.Selenium.Support.UI;

//namespace Sandy_AcceptanceTests
//{
//    [TestClass]
//    public class SandyResponseTest
//    {
//        private IWebDriver driver;
//        private string appURL;

//        [TestInitialize()]
//        public void SetupTest()
//        {
//            string appURL = "https://sandylinux.azurewebsites.net";

//            driver = new FirefoxDriver();
//            driver.Navigate().GoToUrl(appURL);

//            WebDriverWait wait = new WebDriverWait(driver, new TimeSpan(0, 0, 30));
//            wait.Until(drvr => drvr.FindElements(By.ClassName("sandy_incoming_msg")).Count == 2);
//        }

//        [TestMethod]
//        public void GreetingsTest()
//        {
//            string[] msgs = GetResponse("hoi");

//            Assert.AreEqual(msgs[0], "Hallo!");

//            UnknownQuestionTest();
//        }

//        [TestMethod]
//        public void UnknownQuestionTest()
//        {
//            string[] msgs = GetResponse("Hoe heet ik?", 4);

//            Assert.AreEqual(msgs[3], "Wil je een email adres opgeven?");
//        }

//        private string[] GetResponse(string message, int nExpectedResponseMsgs = 1)
//        {
//            int sandyMsgs = driver.FindElements(By.ClassName("sandy_incoming_msg")).Count;
//            int totalMsgsExpected = sandyMsgs + nExpectedResponseMsgs;

//            driver.FindElement(By.Id("messageInput")).SendKeys(message);
//            driver.FindElement(By.Id("sendButton")).Click();

//            WebDriverWait wait = new WebDriverWait(driver, new TimeSpan(0, 0, 10));
//            wait.Until(drvr => drvr.FindElements(By.ClassName("sandy_incoming_msg")).Count >= totalMsgsExpected);

//            // test if we received the expected amount of response messages
//            int totalMsgs = driver.FindElements(By.ClassName("sandy_incoming_msg")).Count;
//            Assert.AreEqual(totalMsgs, totalMsgsExpected);

//            string[] responses = new string[nExpectedResponseMsgs];
//            for (int i = 0; i < responses.Length; i++)
//            {
//                IWebElement rWE = driver.FindElements(By.ClassName("sandy_incoming_msg"))[sandyMsgs + i];
//                responses[i] = rWE.FindElement(By.XPath("div[2]/div/p")).Text;
//            }

//            return responses;
//        }

//        [TestCleanup]
//        public void Clean()
//        {
//            driver.Quit();
//        }
//    }
//}


const puppeteer = require('puppeteer');
var beep = require('beepbeep');

const notifier = require('node-notifier');
// String
// notifier.notify('Message');

// Object
// notifier.notify({
//     title: 'My notification',
//     message: 'Hello, there!'
// });

let scrape = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://www.dsebd.org/latest_share_price_alpha.php?letter=P');

    await page.waitFor(1000);
    const result = await page.evaluate(() => {
        let confidcemPrice = document.querySelector('body > table:nth-child(10) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(9) > td:nth-child(3) > div > font').innerText;
        let pdlPrice = document.querySelector('body > table:nth-child(10) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(5) > td:nth-child(3) > div > font').innerText;
          return {
              confidcemPrice,
              pdlPrice
        }

    });

    browser.close();
    return result;
};
function test() {
   scrape().then((value)=>{
       if (value.pdlPrice < 16.7) {
               console.log('Price now: '+value.pdlPrice)
               console.log(' Buy price: '+16.7)
           let a=parseFloat(value.pdlPrice)
           let b=a-16.7
           console.log(' Difference: '+b);
           notifier.notify(
               {
                   title: 'Share Price',
                   message: 'Price now: '+value.pdlPrice+'\nDifference: '+b,
                   // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
                   sound: false, // Only Notification Center or Windows Toasters
                   wait: true, // Wait with callback, until user action is taken against notification
                   timeout: 20,
               },  function(err, response) {
                   if(response){
                       test()
                   }
                   if(err){
                       test()
                   }
                   // beep(5000,1000)
                   // Response is response from notification
               });

               //notifier.notify('Price now: '+value.confidcemPrice);
               //beep(5000,1000)
       } else {
           console.log("unchanged,+Price now:"+value.pdlPrice); // Success!
           test()
       }
   });

}

test()


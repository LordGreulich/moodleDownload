import { ElementHandle } from 'puppeteer';
import puppeteer from 'puppeteer-core';
import { ListFormat } from 'typescript';
import PouchDB from 'pouchdb';
require('dotenv').config();

interface klass {
    title: string;
    link: string;
    downloadAllFiles: boolean;
}

(async () => {
    if(process.env.password == undefined) {
        console.log("password was not provided. Please include .env file")
        return;
    }

    let pouchDB = new PouchDB('moodleDownloadDB');
    pouchDB.info().then( function (info) {
        console.log(info);
    });
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto('https://moodle.dhbw.de/');

    await page.$$('input').then( element => {
        element[2].click();
    });
    await page.waitForNavigation();

    let usernameElements = await page.$$('input');
    await usernameElements[0].type('grauel.leo.a22@dh-karlsruhe.de');
    await usernameElements[1].type(process.env.password!);
    await page.$$('button').then( element => {
        element[0].click();
    });
    await page.waitForNavigation();

    const allClassesLinks = await page.$$('#inst5049 > div.content > ul a');
    allClassesLinks.forEach(async link => {
        
        console.log((await link.getProperty('title')).jsonValue());
    });
    console.log((await allClassesLinks[0].getProperty('title')).jsonValue());
    await page.screenshot({path: 'test.png'});
    console.log("Screenshot saved");

    /* // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    await page.type('.search-box__input', 'automate beyond recorder');

    // Wait and click on first result
    const searchResultSelector = '.search-box__link';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
        'text/Customize and automate'
    );
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // Print the full title
    console.log('The title of this blog post is "%s".', fullTitle); */

    await browser.close();
})();

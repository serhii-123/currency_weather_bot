import { config } from 'dotenv';
import { Bot, Keyboard } from 'grammy';
import {
    WeatherConversations,
    CurrencyDataFetcher, CurrencyMsgBuilder, CurrencyError
} from './classes';
import { MyContext } from './types';
import {
    conversations,
    createConversation
} from '@grammyjs/conversations';

config();

async function start() {
    const BOT_TOKEN: string = process.env.BOT_TOKEN as string;
    const WEATHER_TOKEN: string = process.env.WEATHER_TOKEN as string;
    
    const bot = new Bot<MyContext>(BOT_TOKEN);

    bot.use(conversations());
    bot.use(createConversation(WeatherConversations.windConversation));
    bot.use(createConversation(WeatherConversations.weatherWithIntervalConversation));

    bot.command('start', async c => {
        try {
            const kb = new Keyboard()
                .text('Погода')
                .row()
                .text('Курс валют');
            
            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Погода', async c => {
        try {
            const kb = new Keyboard()
                .text('Кожні 3 години')
                .text('Кожні 6 годин')
                .row()
                .text('Вітер')
                .row()
                .text('Попереднє меню');
            
            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Курс валют', async c => {
        try {
            const kb = new Keyboard()
                .text('USD')
                .text('EUR')
                .row()
                .text('Попереднє меню');

            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Попереднє меню', async c => {
        try {
            const kb = new Keyboard()
                .text('Погода')
                .row()
                .text('Курс валют');
            
            c.reply('...', {
                reply_markup: kb
            });
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('Вітер', async c => {
        await c.conversation.enter('windConversation', WEATHER_TOKEN);
    });

    bot.hears('Кожні 3 години', async c => {
        const hoursInterval: number = 3;

        await c.conversation.enter(
            'weatherWithIntervalConversation',
            WEATHER_TOKEN,
            hoursInterval
        );
    });

    bot.hears('Кожні 6 годин', async c => {
        const hoursInterval: number = 6;
        
        await c.conversation.enter(
            'weatherWithIntervalConversation',
            WEATHER_TOKEN,
            hoursInterval
        );
    });

    bot.hears('USD', async c => {
        try {
            const currencyObj = await CurrencyDataFetcher.getUSDData();
            const msg: string = await CurrencyMsgBuilder.getMessage(currencyObj);

            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.hears('EUR', async c => {
        try {
            const currencyObj = await CurrencyDataFetcher.getEURData();
            const msg: string = await CurrencyMsgBuilder.getMessage(currencyObj);

            c.reply(msg);
        } catch(e) {
            await handleBotHandlerError(e);
        }
    });

    bot.catch((err) => {
        const sliceIndex: number = err.message.indexOf(':') + 2;
        const message = err.message.slice(sliceIndex);
        
        console.log(err.message);
        err.ctx.reply(message);
    });

    async function handleBotHandlerError(e) {
        if(e instanceof CurrencyError)
            throw new Error('Не вдається отримати дані про курси валют. Будь ласка, спробуйте пізніше');
        else
            throw new Error('Сталася помилка. Будь ласка, спробуйте пізніше');
    }

    bot.start();
}

start();

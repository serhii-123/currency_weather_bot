import { Context } from 'grammy';
import { MyConversation } from '../types';
import { WeatherMsgBuilder, WeatherDataFetcher } from './index'

class WeatherConversations {
    static async windConversation(
        conversation: MyConversation,
        ctx0: Context,
        token: string,
    ) {
        const wdf: WeatherDataFetcher = new WeatherDataFetcher(token);

        await ctx0.reply('Будь ласка, введіть місто');

        try {
            const ctx1 = await conversation.waitFor('message:text');
            const input: string = ctx1.message.text;
            const weatherData: string = await conversation.external(
                () => wdf.getData(input, 'weather')
            );
            const message: string = await conversation.external(
                () => WeatherMsgBuilder.getWindReply(weatherData)
            );

            ctx0.reply(message);
        } catch(e) {
            if(e instanceof Error)
                console.log(e.message);

            ctx0.reply('Не вдалося отримати дані для вашого міста. Будь ласка, спробуйте ще раз');
        }
    }
    static async weatherWithIntervalConversation(
        conversation: MyConversation,
        ctx0: Context,
        token: string,
        interval: 3 | 6
    ) {
        const wdf: WeatherDataFetcher = new WeatherDataFetcher(token);
    
        await ctx0.reply('Будь ласка, введіть місто');
        
        try {
            const ctx1 = await conversation.waitFor('message:text');
            const input: string = ctx1.message.text;
            const weatherData: string = await conversation.external(
                () => wdf.getData(input, 'forecast')
            );
            const message: string = await conversation.external(
                () => WeatherMsgBuilder.getReplyWithInterval(weatherData, input, interval)
            );
            
            ctx0.reply(message);
        } catch(e) {
            if(e instanceof Error)
                console.log(e.message);

            ctx0.reply('Не вдалося отримати дані для вашого міста. Будь ласка, спробуйте ще раз');
        }
    }
}

export default WeatherConversations;
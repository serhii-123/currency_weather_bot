import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";

type MyContext = ConversationFlavor<Context>;
type MyConversationContext = Context;
type MyConversation = Conversation<MyContext, MyConversationContext>;
type Bank = 'privatbank' | 'monobank'
type CurrencyResponse = {
    response: any,
    bank: Bank
}
type CurrencyData = {
    currency: 'USD' | 'EUR',
    rateBuy: string,
    rateSell: string,
    bank: Bank
};

export {
    MyContext,
    MyConversation,
    CurrencyResponse,
    CurrencyData
};
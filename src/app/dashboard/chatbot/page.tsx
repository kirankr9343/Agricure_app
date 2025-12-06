
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, User, AlertCircle, Bot, Languages } from "lucide-react";
import { chatbotSupport } from "@/ai/flows/chatbot-support";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation, languages as appLanguages } from "@/hooks/use-language";


type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isExpertHelpNeeded?: boolean;
};

export default function ChatbotPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [languageSelected, setLanguageSelected] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleStartChat = async () => {
    if (!preferredLanguage) return;

    setIsLoading(true);
    try {
        const initialQuery = t('dashboard.chatbot.initialQuery');
        const result = await chatbotSupport({ query: initialQuery, preferredLanguage });
        
        setMessages([
            {
                id: 'init',
                role: 'assistant',
                content: result.response
            }
        ]);
        setLanguageSelected(true);
    } catch (error: any) {
        console.error("Error starting chat:", error);
         let errorMessageContent = t('dashboard.chatbot.error.connect');
          if (error.message && error.message.includes('503')) {
            errorMessageContent = t('dashboard.chatbot.error.overloaded');
          }
           setMessages([{
            id: 'error-init',
            role: 'assistant',
            content: errorMessageContent
           }]);
           setLanguageSelected(true); // Still show chat to display error
    } finally {
        setIsLoading(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatbotSupport({ query: input, preferredLanguage });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        isExpertHelpNeeded: result.expertHelpNeeded,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error calling chatbot support:", error);
      let errorMessageContent = t('dashboard.chatbot.error.connect');
      if (error.message && error.message.includes('503')) {
        errorMessageContent = t('dashboard.chatbot.error.overloaded');
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessageContent,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
       <div className="space-y-1 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.chatbot.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.chatbot.description')}</p>
      </div>

      {!languageSelected ? (
        <Card className="flex-1 flex flex-col items-center justify-center p-6">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t('dashboard.chatbot.selectLanguageTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="w-full max-w-sm space-y-4">
                <Select onValueChange={setPreferredLanguage} value={preferredLanguage}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('dashboard.chatbot.selectLanguagePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {appLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.label}>{lang.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className="w-full" onClick={handleStartChat} disabled={!preferredLanguage || isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                    {t('dashboard.chatbot.startChat')}
                </Button>
            </CardContent>
        </Card>
      ) : (
        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-0">
               <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                   <div className="space-y-4">
                      {messages.map((message) => (
                      <div
                          key={message.id}
                          className={`flex items-start gap-3 ${
                          message.role === "user" ? "justify-end" : ""
                          }`}
                      >
                          {message.role === "assistant" && (
                          <Avatar>
                              <AvatarFallback><Bot/></AvatarFallback>
                          </Avatar>
                          )}
                          <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] prose prose-sm dark:prose-invert prose-p:my-2 prose-headings:my-3 ${
                              message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                          >
                          <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\\n/g, '<br />') }} />
                          
                          {message.isExpertHelpNeeded && (
                              <Alert className="mt-2 bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
                                  <AlertCircle className="h-4 w-4 !left-3 !top-3 text-amber-600 dark:text-amber-400" />
                                  <AlertDescription className="text-amber-900 dark:text-amber-200 text-xs">
                                      {t('dashboard.chatbot.expertHelpNeeded')}
                                  </AlertDescription>
                              </Alert>
                          )}
                          </div>
                          {message.role === "user" && (
                          <Avatar>
                              <AvatarFallback>
                              <User />
                              </AvatarFallback>
                          </Avatar>
                          )}
                      </div>
                      ))}
                      {isLoading && (
                      <div className="flex items-start gap-3">
                          <Avatar>
                          <AvatarFallback><Bot/></AvatarFallback>
                          </Avatar>
                          <div className="rounded-lg px-4 py-3 bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                      </div>
                      )}
                  </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('dashboard.chatbot.inputPlaceholder')}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
            </form>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}

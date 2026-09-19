import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Message } from '../../types';

export const ConversationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('l-101');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'buyer',
      text: 'Hello, are these Dell PowerEdge R740 server units still available in Bengaluru?',
      sentAt: '10:14 AM',
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: '🤖 CircleLoop AI Assistant: Yes, 3 units of Dell PowerEdge R740 Server Units are currently listed as Available in Bengaluru, KA at ₹68,000/unit.',
      sentAt: '10:14 AM',
    },
    {
      id: 'm-3',
      sender: 'buyer',
      text: 'Can we schedule an on-site testing inspection tomorrow morning?',
      sentAt: '10:16 AM',
    },
    {
      id: 'm-4',
      sender: 'seller',
      text: 'Sure! Our TechCorp Hub 4 facility in Bengaluru is open for inspection from 10:00 AM to 5:00 PM.',
      sentAt: '10:18 AM',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      text: inputText,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText.toLowerCase();
    setInputText('');

    // Trigger instant AI Assistant Auto-Reply
    setTimeout(() => {
      let aiText = '';
      if (currentInput.includes('price') || currentInput.includes('cost')) {
        aiText = '🤖 CircleLoop AI Assistant: The listed price is ₹68,000 per unit (Est. New: ₹2.4L).';
      } else if (currentInput.includes('condition') || currentInput.includes('warranty')) {
        aiText = '🤖 CircleLoop AI Assistant: Condition is listed as "Good". Tested RAM and redundant 750W power supply modules are intact.';
      } else {
        aiText = '🤖 CircleLoop AI Assistant: Message received! Your inquiry has been dispatched to TechCorp Hub 4 representative.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 500);
  };

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-hero text-3xl font-bold text-primary">Buyer & Seller Conversations</h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Direct buyer messaging integrated with CircleLoop AI Assistant for specification Q&A.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        {/* Chat List Sidebar */}
        <Card className="lg:col-span-4 border border-outline/10 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="font-label-sm text-xs text-outline uppercase font-semibold mb-2">Active Conversations</div>
          
          <div
            onClick={() => setActiveTab('l-101')}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${
              activeTab === 'l-101'
                ? 'bg-secondary-fixed/30 border-secondary'
                : 'bg-surface-container-low border-outline/10 hover:bg-surface-container'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline-sm text-sm font-bold text-primary truncate">Dell PowerEdge R740</span>
              <Badge variant="secondary">AI Assistant</Badge>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant truncate">
              TechCorp Hub 4 • Bengaluru, KA
            </p>
          </div>
        </Card>

        {/* Active Chat Window */}
        <Card className="lg:col-span-8 border border-outline/10 p-4 flex flex-col justify-between">
          {/* Header */}
          <div className="pb-3 border-b border-outline/10 flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-primary">Dell PowerEdge R740 Server Units (x3)</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">Seller: TechCorp Hub 4 (Verified Org)</p>
            </div>
            <Badge variant="accent" icon="smart_toy">AI Grounded Q&A</Badge>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${
                  m.sender === 'buyer'
                    ? 'self-end items-end'
                    : 'self-start items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-xl text-xs ${
                    m.sender === 'buyer'
                      ? 'bg-primary text-on-primary rounded-br-none'
                      : m.sender === 'ai'
                      ? 'bg-secondary-fixed/30 text-on-secondary-fixed-variant border border-secondary/20 rounded-bl-none'
                      : 'bg-surface-container text-on-surface rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-outline mt-1 font-mono">{m.sentAt}</span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-outline/10 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about price, condition, specs, or availability..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 py-2.5 px-3.5 rounded-lg bg-surface-container-low text-on-surface text-xs border border-outline/20 focus:outline-none focus:border-secondary"
            />
            <Button type="submit" variant="primary" icon={<span className="material-symbols-outlined text-[18px]">send</span>}>
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

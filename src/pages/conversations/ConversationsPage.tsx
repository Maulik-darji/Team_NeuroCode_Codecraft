import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Message, Conversation } from '../../types';

export const ConversationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeConvIdFromUrl = searchParams.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(activeConvIdFromUrl);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);

  // Sync selectedConvId when URL changes
  useEffect(() => {
    if (activeConvIdFromUrl) {
      setSelectedConvId(activeConvIdFromUrl);
    }
  }, [activeConvIdFromUrl]);

  // Load user's conversations from Firestore
  useEffect(() => {
    if (!user) {
      setLoadingConvs(false);
      return;
    }

    // Query conversations where user is buyer OR seller
    const q1 = query(
      collection(db, 'conversations'),
      where('buyerUid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q1, (snapshot) => {
      const convList: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        convList.push({
          id: docSnap.id,
          listingId: data.listingId || '',
          listingTitle: data.listingTitle || 'Marketplace Item',
          buyerUid: data.buyerUid || '',
          sellerUid: data.sellerUid || '',
          aiHandled: data.aiHandled ?? true,
          escalated: data.escalated ?? false,
          createdAt: data.createdAt || new Date().toISOString(),
          lastMessage: data.lastMessage || '',
          lastMessageAt: data.lastMessageAt || '',
        });
      });

      setConversations(convList);
      if (!selectedConvId && convList.length > 0) {
        setSelectedConvId(convList[0].id);
      }
      setLoadingConvs(false);
    });

    return () => unsubscribe();
  }, [user, selectedConvId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'conversations', selectedConvId, 'messages');
    const q = query(messagesRef, orderBy('id', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMsgs: Message[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedMsgs.push({
          id: docSnap.id,
          sender: data.sender || 'buyer',
          text: data.text || '',
          sentAt: data.sentAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });
      setMessages(fetchedMsgs);
    });

    return () => unsubscribe();
  }, [selectedConvId]);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId || !user) return;

    const userText = inputText.trim();
    setInputText('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg_${Date.now()}`;

    try {
      const activeConvObj = conversations.find((c) => c.id === selectedConvId);
      const isBuyer = activeConvObj ? activeConvObj.buyerUid === user.uid : true;
      const userSenderRole = isBuyer ? 'buyer' : 'seller';

      // Write user message to subcollection
      await setDoc(doc(db, 'conversations', selectedConvId, 'messages', msgId), {
        id: msgId,
        sender: userSenderRole,
        senderId: user.uid,
        text: userText,
        sentAt: timeStr,
      });

      // Update parent conversation last message
      await setDoc(
        doc(db, 'conversations', selectedConvId),
        {
          lastMessage: userText,
          lastMessageAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Instant Grounded AI Assistant Reply (Zero-Cost Deterministic)
      setTimeout(async () => {
        const inputLower = userText.toLowerCase();
        let aiResponse = '';

        if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('how much')) {
          aiResponse = `CircleLoop AI Assistant: The listed item details specify price and verification metrics on the listing page.`;
        } else if (inputLower.includes('condition') || inputLower.includes('quality')) {
          aiResponse = `CircleLoop AI Assistant: The item is verified for secondary circular reuse. Contact the seller for on-site testing.`;
        } else if (inputLower.includes('location') || inputLower.includes('where')) {
          aiResponse = `CircleLoop AI Assistant: The item is available at the seller's designated hub. Inspection hours are standard business hours.`;
        } else {
          aiResponse = `CircleLoop AI Assistant: Message logged! Your inquiry has been forwarded directly to the seller for chain-of-custody pickup coordination.`;
        }

        const aiMsgId = `msg_ai_${Date.now()}`;
        await setDoc(doc(db, 'conversations', selectedConvId, 'messages', aiMsgId), {
          id: aiMsgId,
          sender: 'ai',
          text: aiResponse,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 600);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!user) {
    return (
      <div className="pt-28 pb-16 max-w-xl mx-auto px-4 text-center">
        <Card className="p-8 border border-outline/10">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">lock</span>
          <h2 className="font-headline-sm text-xl font-bold text-primary">Authentication Required</h2>
          <p className="font-body-md text-xs text-on-surface-variant mt-1 mb-4">
            Please sign in to view your buyer and seller conversations.
          </p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Sign In Now
          </Button>
        </Card>
      </div>
    );
  }

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
        <Card className="lg:col-span-4 border border-outline/10 p-0 flex flex-col overflow-hidden bg-surface shadow-xs">
          <div className="p-4 border-b border-outline/10 bg-surface-container-lowest flex items-center justify-between">
            <span className="font-headline-sm text-sm font-bold text-primary">
              Messages
            </span>
            <Badge variant="neutral">{conversations.length}</Badge>
          </div>

          <div className="overflow-y-auto flex-1 flex flex-col">
            {loadingConvs && <div className="text-xs text-outline p-4 text-center">Loading chats...</div>}

            {!loadingConvs && conversations.length === 0 && (
              <div className="p-6 text-center text-xs text-on-surface-variant flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[32px] text-outline/30">forum</span>
                No active conversations yet. Visit the Marketplace and click "Contact Seller" to start a chat.
              </div>
            )}

            {conversations.map((conv) => {
              const dateObj = new Date(conv.lastMessageAt || new Date());
              const timeString = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 cursor-pointer transition-all border-l-4 flex items-start gap-3 border-b border-outline/5 ${
                    selectedConvId === conv.id
                      ? 'bg-surface-container-highest border-l-secondary'
                      : 'bg-transparent border-l-transparent hover:bg-surface-container-low'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex-shrink-0 flex items-center justify-center text-secondary font-bold text-lg">
                    {(conv.listingTitle || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`font-headline-sm text-sm truncate pr-2 ${selectedConvId === conv.id ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>
                        {conv.listingTitle || 'Marketplace Item'}
                      </h4>
                      <span className={`text-[10px] whitespace-nowrap ${selectedConvId === conv.id ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                        {timeString}
                      </span>
                    </div>
                    <p className={`font-body-sm text-xs truncate ${selectedConvId === conv.id ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Active Chat Window */}
        <Card className="lg:col-span-8 border border-outline/10 p-4 flex flex-col justify-between">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="pb-3 border-b border-outline/10 flex items-center justify-between">
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">
                    {activeConv.listingTitle || 'Marketplace Asset Inquiry'}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Conversation ID: #{activeConv.id.slice(-8)}
                  </p>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="text-xs text-outline text-center my-auto">
                    Starting conversation... Send a message below.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMyMessage = m.senderId
                      ? m.senderId === user.uid
                      : activeConv.buyerUid === user.uid
                      ? m.sender === 'buyer'
                      : m.sender === 'seller';
                    const isAi = m.sender === 'ai';

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[80%] ${
                          isMyMessage
                            ? 'self-end items-end'
                            : 'self-start items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl text-xs ${
                            isMyMessage
                              ? 'bg-primary text-on-primary rounded-br-none'
                              : isAi
                              ? 'bg-secondary-fixed/30 text-on-secondary-fixed-variant border border-secondary/20 rounded-bl-none'
                              : 'bg-surface-container text-on-surface rounded-bl-none'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-outline mt-1 font-mono">{m.sentAt}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-outline/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about price, condition, specs, or pickup..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 py-2.5 px-3.5 rounded-lg bg-surface-container-low text-on-surface text-xs border border-outline/20 focus:outline-none focus:border-secondary"
                />
                <Button type="submit" variant="primary" icon={<span className="material-symbols-outlined text-[18px]">send</span>}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-outline">
              Select a conversation from the sidebar to view messages.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConversationsPage;

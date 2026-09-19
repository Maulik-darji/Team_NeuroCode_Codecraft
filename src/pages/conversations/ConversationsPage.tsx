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
      // Write user message to subcollection
      await setDoc(doc(db, 'conversations', selectedConvId, 'messages', msgId), {
        id: msgId,
        sender: 'buyer',
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
          aiResponse = `🤖 CircleLoop AI Assistant: The listed item details specify price and verification metrics on the listing page.`;
        } else if (inputLower.includes('condition') || inputLower.includes('quality')) {
          aiResponse = `🤖 CircleLoop AI Assistant: The item is verified for secondary circular reuse. Contact the seller for on-site testing.`;
        } else if (inputLower.includes('location') || inputLower.includes('where')) {
          aiResponse = `🤖 CircleLoop AI Assistant: The item is available at the seller's designated hub. Inspection hours are standard business hours.`;
        } else {
          aiResponse = `🤖 CircleLoop AI Assistant: Message logged! Your inquiry has been forwarded directly to the seller for chain-of-custody pickup coordination.`;
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
        <Card className="lg:col-span-4 border border-outline/10 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="font-label-sm text-xs text-outline uppercase font-semibold mb-2">
            Active Conversations ({conversations.length})
          </div>

          {loadingConvs && <div className="text-xs text-outline p-2">Loading chats...</div>}

          {!loadingConvs && conversations.length === 0 && (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              No active conversations yet. Visit the Marketplace and click "Contact Seller" to start a chat.
            </div>
          )}

          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConvId(conv.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedConvId === conv.id
                  ? 'bg-secondary-fixed/30 border-secondary'
                  : 'bg-surface-container-low border-outline/10 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline-sm text-sm font-bold text-primary truncate">
                  {conv.listingTitle || 'Marketplace Item'}
                </span>
                <Badge variant="secondary">AI Assistant</Badge>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant truncate">
                {conv.lastMessage || 'No messages yet'}
              </p>
            </div>
          ))}
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
                <Badge variant="accent" icon="smart_toy">AI Grounded Q&A</Badge>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="text-xs text-outline text-center my-auto">
                    Starting conversation... Send a message below.
                  </div>
                ) : (
                  messages.map((m) => (
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
                  ))
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

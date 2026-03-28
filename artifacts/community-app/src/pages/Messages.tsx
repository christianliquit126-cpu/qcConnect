import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useChats, useChatMessages, useUsers } from "@/hooks/useChat";
import { Send, Search, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Messages() {
  const { user, userProfile } = useAuth();
  const [, setLocation] = useLocation();
  const { chats, loading: chatsLoading, startChat } = useChats();
  const { users } = useUsers();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const activeChat = chats.find((c) => c.chatId === activeChatId);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to access messages</p>
          <Button onClick={() => setLocation("/login")} className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
        </div>
      </div>
    );
  }

  const handleStartChat = async (uid: string) => {
    const chatId = await startChat(uid);
    setActiveChatId(chatId);
    setShowNewChat(false);
    setMobileView("chat");
  };

  const filteredChats = chats.filter((c) =>
    c.otherUser?.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-0 sm:px-4 sm:py-6">
        <div className="bg-white dark:bg-gray-900 rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden flex" style={{ height: "calc(100vh - 80px)" }}>

          <div className={`w-full sm:w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 ${mobileView === "chat" ? "hidden sm:flex" : "flex"}`}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Messages</h2>
                <Button size="sm" variant="outline" onClick={() => setShowNewChat(!showNewChat)} className="text-xs h-8">
                  New Chat
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations" className="pl-9 h-8 text-xs" />
              </div>
            </div>

            {showNewChat && (
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/10">
                <p className="text-xs text-gray-500 mb-2 font-medium">Start a new conversation:</p>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search users..." className="pl-8 h-7 text-xs" />
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.uid}
                      onClick={() => handleStartChat(u.uid)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {chatsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-blue-500 animate-spin" /></div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <p className="text-sm text-gray-500">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "New Chat" to start messaging</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.chatId}
                    onClick={() => { setActiveChatId(chat.chatId); setMobileView("chat"); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${activeChatId === chat.chatId ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <img src={chat.otherUser?.avatar || ""} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 bg-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{chat.otherUser?.name}</p>
                        <p className="text-xs text-gray-400 shrink-0 ml-2">
                          {chat.lastMessageTime ? timeAgo(chat.lastMessageTime.seconds) : ""}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{chat.lastMessage || "Start a conversation"}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}>
            {!activeChatId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-blue-500" />
                  </div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Select a conversation</p>
                  <p className="text-sm text-gray-400 mt-1">or start a new one</p>
                </div>
              </div>
            ) : (
              <ChatView
                chatId={activeChatId}
                otherUser={activeChat?.otherUser}
                onBack={() => { setActiveChatId(null); setMobileView("list"); }}
                currentUserId={user.uid}
                currentUserAvatar={userProfile?.avatar || ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatViewProps {
  chatId: string;
  otherUser?: { name: string; avatar: string };
  onBack: () => void;
  currentUserId: string;
  currentUserAvatar: string;
}

function ChatView({ chatId, otherUser, onBack, currentUserId, currentUserAvatar }: ChatViewProps) {
  const { messages, typing, sendMessage, setTypingIndicator } = useChatMessages(chatId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await sendMessage(text.trim());
    setText("");
    setSending(false);
    await setTypingIndicator(false);
  };

  const handleTyping = (val: string) => {
    setText(val);
    setTypingIndicator(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTypingIndicator(false), 2000);
  };

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Button variant="ghost" size="icon" className="sm:hidden w-8 h-8" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <img src={otherUser?.avatar || ""} alt="" className="w-9 h-9 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-white">{otherUser?.name}</p>
          {typing && <p className="text-xs text-green-500">typing...</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
        {messages.map((msg) => {
          const isMe = msg.uid === currentUserId;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <img src={otherUser?.avatar || ""} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
              )}
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                isMe
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
              {isMe && (
                <img src={currentUserAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Textarea
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-0 max-h-32 resize-none text-sm rounded-xl"
          rows={1}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as React.FormEvent); }}}
        />
        <Button type="submit" size="icon" className="w-9 h-9 bg-blue-600 hover:bg-blue-700 shrink-0" disabled={sending || !text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </>
  );
}

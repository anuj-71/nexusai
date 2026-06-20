import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, MessageCircle } from 'lucide-react'

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  const isStartup = profile.role === 'startup'

  const mockConversations = [
    {
      id: '1',
      name: 'Horizon Ventures',
      lastMessage: 'Interested in learning more about your metrics.',
      time: '2 hours ago',
      unread: 2,
      avatar: 'HV',
    },
    {
      id: '2',
      name: 'Catalyst Fund',
      lastMessage: 'Can we schedule a call next week?',
      time: '5 hours ago',
      unread: 0,
      avatar: 'CF',
    },
    {
      id: '3',
      name: 'Growth Partners',
      lastMessage: 'You: Thanks for the feedback on our deck!',
      time: '1 day ago',
      unread: 0,
      avatar: 'GP',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <MainNav isStartup={isStartup} userName={profile.full_name} />

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2">
                {mockConversations.map(conv => (
                  <button
                    key={conv.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border-l-2 border-transparent hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-sm font-semibold">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{conv.name}</p>
                        <p className="text-xs text-slate-600">{conv.time}</p>
                      </div>
                      {conv.unread > 0 && (
                        <div className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate">{conv.lastMessage}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b border-slate-200">
                <CardTitle>Horizon Ventures</CardTitle>
                <p className="text-xs text-slate-600 mt-1">Active now</p>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex-shrink-0"></div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Horizon Ventures</p>
                    <div className="bg-slate-100 rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm text-slate-900">
                        Thanks for sharing your pitch deck. Impressive metrics!
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-slate-600">You</p>
                    <div className={`${isStartup ? 'bg-emerald-600' : 'bg-blue-600'} text-white rounded-lg px-4 py-2 max-w-xs`}>
                      <p className="text-sm">Thank you! We'd love to discuss further.</p>
                    </div>
                    <p className="text-xs text-slate-500">1 hour ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex-shrink-0"></div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Horizon Ventures</p>
                    <div className="bg-slate-100 rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm text-slate-900">
                        Interested in learning more about your metrics.
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">Just now</p>
                  </div>
                </div>
              </CardContent>

              {/* Input */}
              <div className="border-t border-slate-200 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1 h-10"
                  />
                  <Button className={`${isStartup ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

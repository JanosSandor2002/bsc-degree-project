/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: egyes kódrészletek generálása, hibakeresése
 * és javítása Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

type MailUser = { _id: string; username: string; email: string };

type Mail = {
  _id: string;
  from: MailUser;
  to: MailUser;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffH < 168) return `${Math.floor(diffH / 24)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Mails = () => {
  const { state } = useGlobalContext();

  const [tab, setTab] = useState<'inbox' | 'sent'>('inbox');
  const [inbox, setInbox] = useState<Mail[]>([]);
  const [sent, setSent] = useState<Mail[]>([]);
  const [selected, setSelected] = useState<Mail | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [compose, setCompose] = useState({
    toUsername: '',
    subject: '',
    body: '',
  });
  const [composeError, setComposeError] = useState('');

  const headers = { Authorization: `Bearer ${state.token}` };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMails = async () => {
    if (!state.token) return;
    setLoading(true);
    try {
      const [inboxRes, sentRes] = await Promise.all([
        axios.get(`${API_URL}/mails/inbox`, { headers }),
        axios.get(`${API_URL}/mails/sent`, { headers }),
      ]);
      setInbox(inboxRes.data);
      setSent(sentRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [state.token]);

  const handleOpen = async (mail: Mail) => {
    setSelected(mail);
    setShowCompose(false);
    // Mark as read if it's  unread
    if (!mail.read && tab === 'inbox') {
      try {
        await axios.put(`${API_URL}/mails/${mail._id}/read`, {}, { headers });
        setInbox((prev) =>
          prev.map((m) => (m._id === mail._id ? { ...m, read: true } : m)),
        );
      } catch {}
    }
  };

  const handleDelete = async (mailId: string) => {
    if (!confirm('Delete this mail?')) return;
    try {
      await axios.delete(`${API_URL}/mails/${mailId}`, { headers });
      setInbox((prev) => prev.filter((m) => m._id !== mailId));
      setSent((prev) => prev.filter((m) => m._id !== mailId));
      if (selected?._id === mailId) setSelected(null);
      showToast('Mail deleted', true);
    } catch {
      showToast('Failed to delete', false);
    }
  };

  const handleSend = async () => {
    setComposeError('');
    if (!compose.toUsername.trim()) {
      setComposeError('Recipient username is required');
      return;
    }
    if (!compose.subject.trim()) {
      setComposeError('Subject is required');
      return;
    }
    if (!compose.body.trim()) {
      setComposeError('Message body is required');
      return;
    }

    setSendLoading(true);
    try {
      const res = await axios.post(`${API_URL}/mails/send`, compose, {
        headers,
      });
      setSent((prev) => [res.data, ...prev]);
      setCompose({ toUsername: '', subject: '', body: '' });
      setShowCompose(false);
      setTab('sent');
      showToast('Mail sent successfully', true);
    } catch (err: any) {
      setComposeError(err.response?.data?.message || 'Failed to send mail');
    } finally {
      setSendLoading(false);
    }
  };

  const unreadCount = inbox.filter((m) => !m.read).length;
  const currentList = tab === 'inbox' ? inbox : sent;

  if (!state.user) {
    return (
      <div className='min-h-full flex flex-col'>
        <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2'>
            Mails
          </div>
          <h1 className='text-2xl font-bold text-white'>Mails</h1>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-sm text-gray-400'>Sign in to access your mails.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-full flex flex-col'>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg ${toast.ok ? 'bg-green-600' : 'bg-red-500'}`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Hero ── */}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden shrink-0'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
              Mails
            </div>
            <h1 className='text-2xl font-bold text-white'>Inbox</h1>
            <p className='text-blue-300 text-xs mt-0.5'>
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                : 'All caught up'}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCompose(true);
              setSelected(null);
            }}
            className='shrink-0 bg-white text-blue-900 font-semibold text-xs px-4 py-2 rounded-2xl hover:bg-blue-50 transition-colors'
          >
            ✉ Compose
          </button>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Left panel: mail list */}
        <div className='w-72 shrink-0 flex flex-col border-r border-blue-100 overflow-hidden'>
          {/* Tab bar */}
          <div className='flex bg-blue-50 mx-4 mt-4 rounded-xl p-1 shrink-0'>
            <button
              onClick={() => {
                setTab('inbox');
                setSelected(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${tab === 'inbox' ? 'bg-white text-blue-800 shadow-sm' : 'text-blue-500 hover:text-blue-700'}`}
            >
              Inbox{' '}
              {unreadCount > 0 && (
                <span className='ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full'>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setTab('sent');
                setSelected(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${tab === 'sent' ? 'bg-white text-blue-800 shadow-sm' : 'text-blue-500 hover:text-blue-700'}`}
            >
              Sent
            </button>
          </div>

          {/* Mail list */}
          <div className='flex-1 overflow-auto px-4 py-3 flex flex-col gap-2'>
            {loading && (
              <p className='text-xs text-gray-400 text-center py-4'>
                Loading...
              </p>
            )}

            {!loading && currentList.length === 0 && (
              <div className='flex flex-col items-center justify-center py-10 gap-2'>
                <div className='w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-400'>
                  ✉
                </div>
                <p className='text-xs text-gray-400'>
                  {tab === 'inbox' ? 'No messages yet' : 'Nothing sent yet'}
                </p>
              </div>
            )}

            {currentList.map((mail) => {
              const isSelected = selected?._id === mail._id;
              const isUnread = !mail.read && tab === 'inbox';
              return (
                <button
                  key={mail._id}
                  onClick={() => handleOpen(mail)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 transition-all border ${
                    isSelected
                      ? 'bg-blue-700 border-blue-700'
                      : isUnread
                        ? 'bg-white border-blue-300 hover:border-blue-400'
                        : 'bg-white border-blue-100 hover:border-blue-200'
                  }`}
                >
                  <div className='flex items-center justify-between gap-2 mb-0.5'>
                    <span
                      className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-700'}`}
                    >
                      {tab === 'inbox' ? mail.from.username : mail.to.username}
                    </span>
                    <span
                      className={`text-xs shrink-0 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}
                    >
                      {formatDate(mail.createdAt)}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate ${isSelected ? 'text-blue-100 font-medium' : isUnread ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}
                  >
                    {mail.subject}
                  </p>
                  <p
                    className={`text-xs truncate mt-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}
                  >
                    {mail.body}
                  </p>
                  {isUnread && !isSelected && (
                    <span className='inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1' />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel: compose or read */}
        <div className='flex-1 overflow-auto p-5'>
          {/* Compose form */}
          {showCompose && (
            <div className='flex flex-col gap-4 max-w-lg'>
              <div className='flex items-center justify-between'>
                <p className='font-semibold text-gray-800'>New Message</p>
                <button
                  onClick={() => setShowCompose(false)}
                  className='text-xs text-gray-400 hover:text-gray-600'
                >
                  ✕ Discard
                </button>
              </div>

              <div className='bg-white border border-blue-200 rounded-2xl p-4 flex flex-col gap-3'>
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-500'>
                    To (username)
                  </label>
                  <input
                    type='text'
                    placeholder='Enter recipient username'
                    value={compose.toUsername}
                    onChange={(e) =>
                      setCompose({ ...compose, toUsername: e.target.value })
                    }
                    className='p-2 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                    autoFocus
                  />
                </div>
                <div className='h-px bg-blue-100' />
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-500'>
                    Subject
                  </label>
                  <input
                    type='text'
                    placeholder='What is this about?'
                    value={compose.subject}
                    onChange={(e) =>
                      setCompose({ ...compose, subject: e.target.value })
                    }
                    className='p-2 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                  />
                </div>
                <div className='h-px bg-blue-100' />
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-500'>
                    Message
                  </label>
                  <textarea
                    placeholder='Write your message here...'
                    value={compose.body}
                    onChange={(e) =>
                      setCompose({ ...compose, body: e.target.value })
                    }
                    rows={7}
                    className='p-2 border border-blue-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors'
                  />
                </div>

                {composeError && (
                  <div className='bg-red-50 border border-red-200 rounded-xl px-3 py-2'>
                    <p className='text-xs text-red-600'>{composeError}</p>
                  </div>
                )}

                <button
                  onClick={handleSend}
                  disabled={sendLoading}
                  className='bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors'
                >
                  {sendLoading ? 'Sending...' : '✉ Send Message'}
                </button>
              </div>
            </div>
          )}

          {/* Read mail */}
          {selected && !showCompose && (
            <div className='flex flex-col gap-4 max-w-lg'>
              <div className='flex items-center justify-between gap-3'>
                <button
                  onClick={() => setSelected(null)}
                  className='text-xs text-gray-400 hover:text-gray-600 transition-colors'
                >
                  ← Back
                </button>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className='text-xs border border-red-200 text-red-500 px-2.5 py-1 rounded-xl hover:bg-red-50 transition-colors'
                >
                  Delete
                </button>
              </div>

              <div className='bg-white border border-blue-200 rounded-2xl p-5 flex flex-col gap-4'>
                {/* Subject */}
                <h2 className='text-base font-bold text-gray-800 leading-snug'>
                  {selected.subject}
                </h2>

                {/* Meta */}
                <div className='flex items-center gap-3 flex-wrap'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold'>
                      {selected.from.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className='text-xs font-semibold text-gray-700'>
                        {selected.from.username}
                      </p>
                      <p className='text-xs text-gray-400'>
                        {selected.from.email}
                      </p>
                    </div>
                  </div>
                  <div className='ml-auto text-right'>
                    <p className='text-xs text-gray-400'>
                      To:{' '}
                      <span className='font-medium text-gray-600'>
                        {selected.to.username}
                      </span>
                    </p>
                    <p className='text-xs text-gray-300'>
                      {new Date(selected.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className='h-px bg-blue-100' />

                {/* Body */}
                <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {selected.body}
                </p>

                <div className='h-px bg-blue-100' />

                {/* Reply shortcut */}
                {tab === 'inbox' && (
                  <button
                    onClick={() => {
                      setCompose({
                        toUsername: selected.from.username,
                        subject: `Re: ${selected.subject}`,
                        body: '',
                      });
                      setShowCompose(true);
                      setSelected(null);
                    }}
                    className='self-start border border-blue-200 text-blue-700 text-xs font-medium px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors'
                  >
                    ↩ Reply
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!selected && !showCompose && (
            <div className='flex-1 flex flex-col items-center justify-center py-16 gap-3'>
              <div className='w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-400 text-2xl'>
                ✉
              </div>
              <p className='text-sm font-medium text-gray-500'>
                Select a message to read it
              </p>
              <p className='text-xs text-gray-400'>or compose a new one</p>
              <button
                onClick={() => setShowCompose(true)}
                className='mt-2 bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-2xl hover:bg-blue-600 transition-colors'
              >
                ✉ Compose
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer*/}
      <div className='mx-6 mb-6 mt-4 bg-blue-900 rounded-2xl px-6 py-4 flex items-center justify-between gap-3 shrink-0'>
        <div>
          <p className='text-white font-semibold text-sm'>Acxor Mails</p>
          <p className='text-blue-400 text-xs mt-0.5'>
            Send messages to any registered user by username.
          </p>
        </div>
        <div className='shrink-0 bg-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-xl'>
          ✉ v1.0
        </div>
      </div>
    </div>
  );
};

export default Mails;

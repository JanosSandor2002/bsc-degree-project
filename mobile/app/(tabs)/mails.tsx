import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  fetchInbox,
  fetchSent,
  sendMail,
  markMailRead,
  deleteMail,
} from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { Button, Input, Toast, EmptyState } from '../../components/ui';

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

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffH < 168) return `${Math.floor(diffH / 24)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function MailsScreen() {
  const { state } = useGlobalContext();
  const router = useRouter();
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

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    if (!state.token) return;
    setLoading(true);
    try {
      const [inboxData, sentData] = await Promise.all([
        fetchInbox(state.token),
        fetchSent(state.token),
      ]);
      setInbox(inboxData);
      setSent(sentData);
    } catch (err) {
      console.error('Mail load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [state.token]);

  const handleOpen = async (mail: Mail) => {
    setSelected(mail);
    if (!mail.read && tab === 'inbox' && state.token) {
      try {
        await markMailRead(state.token, mail._id);
        setInbox((prev) =>
          prev.map((m) => (m._id === mail._id ? { ...m, read: true } : m)),
        );
      } catch {}
    }
  };

  const handleDelete = (mailId: string) => {
    Alert.alert('Delete Mail', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!state.token) return;
          try {
            await deleteMail(state.token, mailId);
            setInbox((p) => p.filter((m) => m._id !== mailId));
            setSent((p) => p.filter((m) => m._id !== mailId));
            if (selected?._id === mailId) setSelected(null);
            showToast('Mail deleted', true);
          } catch {
            showToast('Failed to delete', false);
          }
        },
      },
    ]);
  };

  const handleSend = async () => {
    setComposeError('');
    if (!compose.toUsername.trim()) {
      setComposeError('Recipient required');
      return;
    }
    if (!compose.subject.trim()) {
      setComposeError('Subject required');
      return;
    }
    if (!compose.body.trim()) {
      setComposeError('Message required');
      return;
    }
    if (!state.token) return;
    setSendLoading(true);
    try {
      const res = await sendMail(state.token, compose);
      setSent((p) => [res, ...p]);
      setCompose({ toUsername: '', subject: '', body: '' });
      setShowCompose(false);
      setTab('sent');
      showToast('Mail sent successfully', true);
    } catch (err: any) {
      setComposeError(err.message || 'Failed to send');
    } finally {
      setSendLoading(false);
    }
  };

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to access your mails</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentList = tab === 'inbox' ? inbox : sent;
  const unread = inbox.filter((m) => !m.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      {toast && (
        <Toast message={toast.msg} type={toast.ok ? 'success' : 'error'} />
      )}

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Mails</Text>
        </View>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Inbox</Text>
            <Text style={styles.heroSub}>
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.composeBtn}
            onPress={() => {
              setShowCompose(true);
              setSelected(null);
            }}
          >
            <Text style={styles.composeBtnText}>✉ Compose</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'inbox' && styles.tabActive]}
          onPress={() => {
            setTab('inbox');
            setSelected(null);
          }}
        >
          <Text
            style={[styles.tabText, tab === 'inbox' && styles.tabTextActive]}
          >
            Inbox{unread > 0 ? ` (${unread})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'sent' && styles.tabActive]}
          onPress={() => {
            setTab('sent');
            setSelected(null);
          }}
        >
          <Text
            style={[styles.tabText, tab === 'sent' && styles.tabTextActive]}
          >
            Sent
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {loading && <Text style={styles.loadingText}>Loading...</Text>}
        {!loading && currentList.length === 0 && (
          <EmptyState
            icon='✉'
            title={tab === 'inbox' ? 'No messages yet' : 'Nothing sent yet'}
          />
        )}

        {/* mail_id használva */}
        {currentList.map((mail) => {
          const isUnread = !mail.read && tab === 'inbox';
          const isSelected = selected?._id === mail._id;
          return (
            <TouchableOpacity
              key={mail._id}
              style={[
                styles.mailCard,
                isUnread && styles.mailCardUnread,
                isSelected && styles.mailCardSelected,
              ]}
              onPress={() => handleOpen(mail)}
              activeOpacity={0.75}
            >
              <View style={styles.mailCardRow}>
                {/* Avatar */}
                <View style={styles.mailAvatar}>
                  <Text style={styles.mailAvatarText}>
                    {(tab === 'inbox'
                      ? mail.from.username
                      : mail.to.username)[0].toUpperCase()}
                  </Text>
                </View>

                {/* Content */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={styles.mailMeta}>
                    <Text
                      style={[
                        styles.mailSender,
                        isSelected && { color: Colors.white },
                      ]}
                      numberOfLines={1}
                    >
                      {tab === 'inbox' ? mail.from.username : mail.to.username}
                    </Text>
                    <Text
                      style={[
                        styles.mailTime,
                        isSelected && { color: '#bfdbfe' },
                      ]}
                    >
                      {fmtDate(mail.createdAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.mailSubject,
                      isUnread && styles.mailSubjectUnread,
                      isSelected && { color: Colors.white },
                    ]}
                    numberOfLines={1}
                  >
                    {mail.subject}
                  </Text>
                  <Text
                    style={[
                      styles.mailPreview,
                      isSelected && { color: '#bfdbfe' },
                    ]}
                    numberOfLines={1}
                  >
                    {mail.body}
                  </Text>
                </View>

                {isUnread && !isSelected && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Read mail modal*/}
      <Modal
        visible={!!selected && !showCompose}
        animationType='slide'
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {selected && (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              >
                <ScrollView>
                  {/* Header row */}
                  <View style={styles.readHeader}>
                    <TouchableOpacity onPress={() => setSelected(null)}>
                      <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtnWrap}
                      onPress={() => handleDelete(selected._id)}
                    >
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.readSubject}>{selected.subject}</Text>

                  <View style={styles.readMeta}>
                    <View style={styles.readAvatar}>
                      <Text style={styles.readAvatarText}>
                        {selected.from.username[0].toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.readFrom}>
                        {selected.from.username}
                      </Text>
                      <Text style={styles.readEmail}>
                        {selected.from.email}
                      </Text>
                    </View>
                    <Text style={styles.readDate}>
                      {new Date(selected.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </Text>
                  </View>

                  <View style={styles.divider} />
                  <Text style={styles.readBody}>{selected.body}</Text>

                  {tab === 'inbox' && (
                    <TouchableOpacity
                      style={styles.replyBtn}
                      onPress={() => {
                        setCompose({
                          toUsername: selected.from.username,
                          subject: `Re: ${selected.subject}`,
                          body: '',
                        });
                        setSelected(null);
                        setShowCompose(true);
                      }}
                    >
                      <Text style={styles.replyBtnText}>↩ Reply</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </KeyboardAvoidingView>
            )}
          </View>
        </View>
      </Modal>

      {/*Compose modal*/}
      <Modal visible={showCompose} animationType='slide' transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.readHeader}>
                  <Text style={styles.modalTitle}>New Message</Text>

                  <TouchableOpacity
                    style={styles.deleteBtnWrap}
                    onPress={() => {
                      setShowCompose(false);
                      setComposeError('');
                    }}
                  >
                    <Text style={styles.deleteBtnText}>✕ Discard</Text>
                  </TouchableOpacity>
                </View>

                <Input
                  label='To (username)'
                  placeholder='Enter recipient username'
                  value={compose.toUsername}
                  onChangeText={(v: string) =>
                    setCompose({ ...compose, toUsername: v })
                  }
                  autoCapitalize='none'
                />
                <Input
                  label='Subject'
                  placeholder='What is this about?'
                  value={compose.subject}
                  onChangeText={(v: string) =>
                    setCompose({ ...compose, subject: v })
                  }
                />
                <Input
                  label='Message'
                  placeholder='Write your message here...'
                  value={compose.body}
                  onChangeText={(v: string) =>
                    setCompose({ ...compose, body: v })
                  }
                  multiline
                  numberOfLines={6}
                  style={{ minHeight: 120, textAlignVertical: 'top' } as any}
                />

                {composeError ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{composeError}</Text>
                  </View>
                ) : null}

                <Button
                  title={sendLoading ? 'Sending...' : '✉ Send Message'}
                  onPress={handleSend}
                  loading={sendLoading}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centeredText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },

  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  heroBadge: {
    backgroundColor: 'rgba(59,130,246,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  heroSub: { color: '#93c5fd', fontSize: 12, marginTop: 2 },
  composeBtn: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  composeBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBg,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  tabTextActive: { color: Colors.primary },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },

  mailCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mailCardUnread: { borderColor: '#93c5fd' },
  mailCardSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  mailCardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mailAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mailAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  mailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  mailSender: { fontSize: 13, fontWeight: '700', color: Colors.text },
  mailTime: { fontSize: 11, color: Colors.textLight },
  mailSubject: { fontSize: 13, color: Colors.textMuted, marginBottom: 2 },
  mailSubjectUnread: { color: Colors.text, fontWeight: '600' },
  mailPreview: { fontSize: 11, color: Colors.textLight },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },

  readHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backBtn: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },

  deleteBtnWrap: {
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteBtnText: { fontSize: 12, color: Colors.error },

  readSubject: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  readMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  readAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  readFrom: { fontSize: 13, fontWeight: '700', color: Colors.text },
  readEmail: { fontSize: 11, color: Colors.textMuted },
  readDate: { fontSize: 11, color: Colors.textLight },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  readBody: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  replyBtn: {
    marginTop: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  replyBtnText: { color: Colors.primaryLight, fontWeight: '600', fontSize: 13 },

  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: { color: Colors.error, fontSize: 12 },
});

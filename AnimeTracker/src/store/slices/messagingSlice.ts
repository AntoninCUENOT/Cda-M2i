import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Message, Conversation } from '../../types';
import apiClient from '../../services/apiClient';

interface MessagingState {
  conversations: Conversation[];
  currentMessages: Message[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  unreadTotal: number;
}

const initialState: MessagingState = {
  conversations: [],
  currentMessages: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  unreadTotal: 0,
};

export const loadConversations = createAsyncThunk('messaging/loadConversations', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: Conversation[] }>('/conversations');
    return data.data;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Erreur chargement conversations');
  }
});

export const loadMessages = createAsyncThunk(
  'messaging/loadMessages',
  async ({ recipientId }: { recipientId: string }, { rejectWithValue }) => {
    try {
      const convRes = await apiClient.post<{ success: boolean; data: { conversationId: string } }>(
        `/conversations/with/${recipientId}`,
      );
      const conversationId = convRes.data.data.conversationId;

      const msgRes = await apiClient.get<{ success: boolean; data: Message[] }>(
        `/conversations/${conversationId}/messages`,
      );
      return { messages: msgRes.data.data, conversationId };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur chargement messages');
    }
  },
);

export const sendMessage = createAsyncThunk(
  'messaging/send',
  async (
    { conversationId, content }: { conversationId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: Message }>(
        `/conversations/${conversationId}/messages`,
        { content },
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Erreur envoi message");
    }
  },
);

export const markAsRead = createAsyncThunk(
  'messaging/markAsRead',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/conversations/${conversationId}/read`);
      return conversationId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const deleteConversation = createAsyncThunk(
  'messaging/deleteConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/conversations/${conversationId}`);
      return conversationId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur suppression');
    }
  },
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    clearCurrentMessages: state => {
      state.currentMessages = [];
      state.currentConversationId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadConversations.pending, state => { state.isLoading = true; })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.unreadTotal = action.payload.reduce((sum, c) => sum + c.unreadCount, 0);
      })
      .addCase(loadConversations.rejected, state => { state.isLoading = false; })
      .addCase(loadMessages.pending, state => { state.isLoading = true; })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMessages = action.payload.messages;
        state.currentConversationId = action.payload.conversationId;
      })
      .addCase(loadMessages.rejected, state => { state.isLoading = false; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.currentMessages.push(action.payload);
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.conversations = state.conversations.map(c =>
          c.id === action.payload ? { ...c, unreadCount: 0 } : c,
        );
        state.unreadTotal = state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(c => c.id !== action.payload);
        state.unreadTotal = state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      });
  },
});

export const { clearCurrentMessages } = messagingSlice.actions;
export default messagingSlice.reducer;

export const selectConversations = (state: { messaging: MessagingState }) => state.messaging.conversations;
export const selectCurrentMessages = (state: { messaging: MessagingState }) => state.messaging.currentMessages;
export const selectCurrentConversationId = (state: { messaging: MessagingState }) => state.messaging.currentConversationId;
export const selectUnreadTotal = (state: { messaging: MessagingState }) => state.messaging.unreadTotal;

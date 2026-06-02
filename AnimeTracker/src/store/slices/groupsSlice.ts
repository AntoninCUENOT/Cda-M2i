import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DiscussionGroup, GroupMessage } from '../../types';
import apiClient from '../../services/apiClient';

interface GroupsState {
  groups: DiscussionGroup[];
  joinedGroupIds: string[];
  currentGroupMessages: GroupMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  joinedGroupIds: [],
  currentGroupMessages: [],
  isLoading: false,
  error: null,
};

export const loadGroups = createAsyncThunk('groups/load', async () => {
  return { groups: [] as DiscussionGroup[], joinedGroupIds: [] as string[] };
});

export const checkAnimeGroup = createAsyncThunk(
  'groups/checkAnimeGroup',
  async (animeId: number, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: { group: { id_group: string; name: string; id_anime: number }; memberCount: number; isMember: boolean } | null;
      }>(`/groups/anime/${animeId}`);
      if (!data.data) return null;
      const { group, memberCount, isMember } = data.data;
      const discussionGroup: DiscussionGroup = {
        id: group.id_group,
        animeId: group.id_anime,
        animeTitle: group.name,
        animePoster: '',
        memberCount,
        lastActivity: new Date().toISOString(),
      };
      return { group: discussionGroup, isMember };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const createOrJoinGroup = createAsyncThunk(
  'groups/createOrJoin',
  async (
    { animeId, animeTitle }: { animeId: number; animeTitle: string; animePoster?: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiClient.post<{
        success: boolean;
        data: { group: { id_group: string; name: string; id_anime: number }; memberCount: number };
      }>(`/groups/anime/${animeId}`, { animeTitle });

      const { group, memberCount } = data.data;
      const discussionGroup: DiscussionGroup = {
        id: group.id_group,
        animeId: group.id_anime,
        animeTitle: group.name,
        animePoster: '',
        memberCount,
        lastActivity: new Date().toISOString(),
      };
      return { group: discussionGroup, groupId: group.id_group };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const leaveGroup = createAsyncThunk(
  'groups/leave',
  async (groupId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/groups/${groupId}/leave`);
      return groupId;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const loadGroupMessages = createAsyncThunk(
  'groups/loadMessages',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<{ success: boolean; data: GroupMessage[] }>(
        `/groups/${groupId}/messages`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

export const sendGroupMessage = createAsyncThunk(
  'groups/sendMessage',
  async (
    { groupId, content }: { groupId: string; content: string; currentUser?: unknown },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: GroupMessage }>(
        `/groups/${groupId}/messages`,
        { content },
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Erreur');
    }
  },
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearCurrentGroupMessages: state => {
      state.currentGroupMessages = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadGroups.fulfilled, (state, action) => {
        state.groups = action.payload.groups;
        state.joinedGroupIds = action.payload.joinedGroupIds;
      })
      .addCase(checkAnimeGroup.fulfilled, (state, action) => {
        if (!action.payload) return;
        const { group, isMember } = action.payload;
        const idx = state.groups.findIndex(g => g.id === group.id);
        if (idx === -1) state.groups.push(group);
        else state.groups[idx] = group;
        if (isMember && !state.joinedGroupIds.includes(group.id)) {
          state.joinedGroupIds.push(group.id);
        }
        if (!isMember) {
          state.joinedGroupIds = state.joinedGroupIds.filter(id => id !== group.id);
        }
      })
      .addCase(createOrJoinGroup.fulfilled, (state, action) => {
        const { group, groupId } = action.payload;
        const existingIndex = state.groups.findIndex(g => g.id === group.id);
        if (existingIndex === -1) {
          state.groups.push(group);
        } else {
          state.groups[existingIndex] = group;
        }
        if (!state.joinedGroupIds.includes(groupId)) {
          state.joinedGroupIds.push(groupId);
        }
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.joinedGroupIds = state.joinedGroupIds.filter(id => id !== action.payload);
      })
      .addCase(loadGroupMessages.pending, state => { state.isLoading = true; })
      .addCase(loadGroupMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroupMessages = action.payload;
      })
      .addCase(loadGroupMessages.rejected, state => { state.isLoading = false; })
      .addCase(sendGroupMessage.fulfilled, (state, action) => {
        state.currentGroupMessages.push(action.payload);
      });
  },
});

export const { clearCurrentGroupMessages } = groupsSlice.actions;
export default groupsSlice.reducer;

export const selectGroups = (state: { groups: GroupsState }) => state.groups.groups;
export const selectJoinedGroupIds = (state: { groups: GroupsState }) => state.groups.joinedGroupIds;
export const selectJoinedGroups = (state: { groups: GroupsState }) =>
  state.groups.groups.filter(g => state.groups.joinedGroupIds.includes(g.id));
export const selectCurrentGroupMessages = (state: { groups: GroupsState }) => state.groups.currentGroupMessages;

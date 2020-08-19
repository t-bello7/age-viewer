import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getMetaData = createAsyncThunk(
  'database/getMetaData',
  async () => {
    const response = await fetch('/api/v1/db/meta')
    const res = await response.json();
    return res
  }
)

const MetadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    edges: [],
    nodes: [],
    propertyKeys: [],
    status: 'init'
  },
  reducers: {
  },
  extraReducers: {
    [getMetaData.fulfilled]: (state, action) => {
      if (action.payload) {
        return {
          edges: action.payload.edges,
          nodes: action.payload.nodes,
          propertyKeys: action.payload.propertyKeys,
          status: 'connected'
        }
      } else {
        return {
          edges: [],
          nodes: [],
          propertyKeys: [],
          status: 'disconnected'
        }
      }
    }
  }
})

export default MetadataSlice.reducer
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const executeCypherQuery = createAsyncThunk(
  'cypher/executeCypherQuery',
  async (args) => {
    const response = await fetch('/api/v1/cypher', 
    {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({cmd: args[1]})
    })
    if (response.ok) {
      const resData = {}
      resData['key'] = args[0];
      resData['query'] = args[1];
      const res = await response.json();     
      resData['data'] = res['data']
      return resData;
    } else {
      alert("Connection Error")
      return {};
    }
  }

  
)

const CypherSlice = createSlice({
  name: 'cypher',
  initialState: {
    queryResult : {}
  },
  reducers: {
  },
  extraReducers: {
    [executeCypherQuery.pending]: (state, action) => {
    },
    [executeCypherQuery.fulfilled]: (state, action) => {
      state.queryResult[action.payload.key] = {}
      state.queryResult[action.payload.key].response = action.payload
    },
    [executeCypherQuery.rejectd]: (state, action) => {
    }
  }
})

export default CypherSlice.reducer
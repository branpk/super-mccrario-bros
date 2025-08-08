# Leaderboard API

This service exposes HTTP endpoints for recording game runs, assigning usernames, and retrieving a leaderboard.
All requests and responses use JSON payloads.

**Public base URL:** `https://4hqqcv02r4.execute-api.us-east-2.amazonaws.com/Prod`

## Endpoints

### `POST /recordRun`
Record a completed playthrough of a game.

```ts
interface RecordRunRequest {
  /** Identifier for the game */
  gameID: string;
  /** UUID string generated for this run */
  runID: string;
  /** UUID string generated on the player's device */
  deviceID: string;
  /** Game-specific metrics */
  data: object;
}

// Response body is empty
interface RecordRunResponse {}
```

The server automatically records an ISO-8601 `timestamp` for each run when it is stored.

### `POST /username`
Look up the username associated with a device.

```ts
interface UsernameRequest {
  /** UUID string generated on the player's device */
  deviceID: string;
}

interface UsernameResponse {
  /** Username if one has been set, otherwise null */
  username: string | null;
}
```

### `POST /setUsername`
Associate a username with a device.

```ts
interface SetUsernameRequest {
  /** UUID string generated on the player's device */
  deviceID: string;
  /** Username selected by the player */
  username: string;
}

// Response body is empty
interface SetUsernameResponse {}
```

### `POST /leaderboard`
Retrieve top scores for a game. At most five entries are returned. If `deviceID` is supplied and that player is
not already in the top five, their best entry is appended.

Only one entry per username or device is included; additional runs by the same user are ignored.

```ts
interface LeaderboardRequest {
  /** Game identifier */
  gameID: string;
  /** Field inside `data` used for ranking */
  metric: string;
  /** Sort order (default: 'descending') */
  order?: 'ascending' | 'descending';
  /** UUID string of device to include requester's rank */
  deviceID?: string;
}

interface LeaderboardEntry {
  /** 1 is the top score */
  rank: number;
  /** Player's username or 'Anonymous' */
  username: string;
  /** Game-specific metrics */
  data: object;
  /** ISO-8601 timestamp recorded when the run was submitted */
  timestamp: string;
  /** True if this entry belongs to the requesting device */
  isRequester: boolean;
}

type LeaderboardResponse = LeaderboardEntry[];
```


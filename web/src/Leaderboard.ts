const API_BASE = 'https://4hqqcv02r4.execute-api.us-east-2.amazonaws.com/Prod';

function pad2(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

function formatTime(t: number): string {
  const tenths = Math.floor(t * 10);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor((tenths / 10) % 60);
  const tenth = tenths % 10;
  return `${pad2(minutes)}:${pad2(seconds)}.${tenth}`;
}

export class Leaderboard {
  private static deviceID: string;
  private static leaderboardBody: HTMLTableSectionElement;
  private static usernameInput: HTMLInputElement;
  private static setUsernameBtn: HTMLButtonElement;

  static async init() {
    this.deviceID = this.getDeviceID();
    this.leaderboardBody = document.querySelector('#leaderboard tbody')!;
    this.usernameInput = document.getElementById('username') as HTMLInputElement;
    this.setUsernameBtn = document.getElementById('set-username') as HTMLButtonElement;
    this.setUsernameBtn.addEventListener('click', () => this.setUsername());
    await this.loadUsername();
    await this.refresh();
  }

  private static getDeviceID(): string {
    const match = document.cookie.match(/(?:^|; )deviceID=([^;]+)/);
    if (match) return match[1];
    const id = crypto.randomUUID();
    document.cookie = `deviceID=${id}; path=/; max-age=${60 * 60 * 24 * 365}`;
    return id;
  }

  static async recordRun(data: object) {
    const runID = crypto.randomUUID();
    await fetch(`${API_BASE}/recordRun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameID: 'super-mccrario-bros',
        runID,
        deviceID: this.deviceID,
        data,
      }),
    });
    await this.refresh();
  }

  private static async loadUsername() {
    const res = await fetch(`${API_BASE}/username`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceID: this.deviceID }),
    });
    const json = await res.json();
    if (json.username) this.usernameInput.value = json.username;
  }

  private static async setUsername() {
    const username = this.usernameInput.value.trim();
    if (!username) return;
    await fetch(`${API_BASE}/setUsername`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceID: this.deviceID, username }),
    });
    await this.refresh();
  }

  static async refresh() {
    const res = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameID: 'super-mccrario-bros',
        metric: 'totalTime',
        order: 'ascending',
        deviceID: this.deviceID,
      }),
    });
    const entries = await res.json();
    this.leaderboardBody.textContent = '';
    for (const entry of entries) {
      const tr = document.createElement('tr');
      if (entry.isRequester) tr.style.fontWeight = 'bold';
      const rank = document.createElement('td');
      rank.textContent = entry.rank.toString();
      const user = document.createElement('td');
      user.textContent = entry.username;
      const time = document.createElement('td');
      time.textContent = formatTime(entry.data.totalTime);
      tr.append(rank, user, time);
      this.leaderboardBody.appendChild(tr);
    }
  }
}

export const state = () => ({
  pieces: null,
  candidates: null,
  standbys: null,
  size: null,
  score: 0,
  number: 4,
  currentUser: 1,
  gridX: 10, // 縦と横比が違うため
  gridY: 10,
  xHalf: 0, // grid描写更新変数
  yHalf: 0,
  initX: 0, // mousemove時のxHalf起点情報
  initY: 0,
  initDistance: 0, // ピンチ操作の基準情報
  initPosX: 0, // mouseXの起点情報
  initPosY: 0,
  initPos: { x: 0, y: 0 },
  dragFlg: false,
  touchDistance: 0,
  touchTime: 0, // ダブルタッチ無効利用変数
  userId: null,
});


export const mutations = {
  setBoard(state, {
    pieces,
    candidates,
    standbys,
    size,
    score,
  }) {
    state.pieces = pieces;
    state.candidates = candidates;
    state.standbys = standbys;
    state.size = size;
    state.score = score;
  },
  zoomout(state) {
    if (state.gridX >= 30) {
      state.gridX = 30;
    } else {
      state.gridX += 2;
    }
    if (state.gridY >= 30) {
      state.gridY = 30;
    } else {
      state.gridY += 2;
    }
  },
  zoomin(state) {
    if (state.gridX >= 7) state.gridX -= 2;
    if (state.gridY >= 7) state.gridY -= 2;
  },
  changeCurrentUser(state, n) {
    state.currentUser = n;
  },
  setInitPos(state, position) {
    // 基準地点設定
    state.dragFlg = true;
    state.initPos = position;
  },
  pinchStart(state, distance) {
    // 基準距離設定
    state.dragFlg = false;
    state.initDistance = distance;
  },
  gridMove(state, position) {
    const cellWidth = window.innerWidth / state.gridX;
    if (state.dragFlg) {
      const requestXHalf = state.initX - Math.floor((position.x - state.initPos.x) / cellWidth);
      const requestYHalf = state.initY + Math.floor((position.y - state.initPos.y) / cellWidth);
      state.xHalf = requestXHalf;
      state.yHalf = requestYHalf;
    }
  },
  pinchMove(state, distance) {
    const cellWidth = window.innerWidth / state.gridX;
    if ((distance - state.initDistance) > 0) {
      if ((distance - state.initDistance) > cellWidth) {
        if (state.gridX <= 5) {
          state.gridX = 5;
          state.gridY = 5;
        } else {
          state.gridX -= 1;
          state.gridY -= 1;
        }
      }
    } else if ((distance - state.initDistance) < 0) {
      if (state.gridX >= 20) {
        state.gridX = 20;
        state.gridY = 20;
      } else {
        state.gridX += 1;
        state.gridY += 1;
      }
    }
  },
  resetInitPos(state) { // touchend
    state.initDistance = 0;
    state.dragFlg = false;
    // 次の起点場所情報の保存
    state.initX = state.xHalf;
    state.initY = state.yHalf;
    state.touchTime = new Date().getTime();
  },
  setUserId(state, userId) {
    state.userId = userId;
  },
};

export const actions = {
  async getUserId({ commit }) {
    let userId = localStorage.getItem('iReversiUserId');
    if (!userId) {
      const seedLetters = 'abcdefghijklmnopqrstuvwxyz';
      const seedNumbers = '0123456789';
      const len = 6;
      let pwd = '';
      const seed = seedLetters + seedLetters.toUpperCase() + seedNumbers;
      for (let i = 0; i < len; i += 1) {
        pwd += seed[Math.floor(Math.random() * seed.length)];
      }
      userId = pwd;
      localStorage.setItem('iReversiUserId', userId);
    }
    commit('setUserId', userId);
  },
  async getBoard({ commit }) {
    commit('setBoard', await this.$axios.$get('/board'));
  },
  async putPiece({ dispatch }, params) {
    await this.$axios.$post('/piece', params);
    await dispatch('getBoard');
  },
  async resetGame({ dispatch }, keyword) {
    await this.$axios.$delete('/piece', { keyword });
    await dispatch('getBoard');
  },
};

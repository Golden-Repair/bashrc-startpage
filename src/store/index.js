import Vuex from 'vuex'
import Vue from 'vue';
import { FileSystem } from '../util/filesystem/filesystem';

Vue.use(Vuex);

const getDefaultConfig = () => {
    return {
        apps: [
            {
                name: 'filemanager',
                position: { top: 20, left: 50 },
                dimensions: { height: 200, width: 300 },
                visible: true,
            },
            {
                name: 'terminal',
                position: { top: 500, left: 100 },
                dimensions: { height: 200, width: 300 },
                visible: true,
            },
            {
                name: 'todo',
                position: { top: 420, left: 900 },
                dimensions: { height: 220, width: 500 },
                visible: false,
            },
            {
                name: 'weather',
                position: { top: 20, left: 900 },
                dimensions: { height: 250, width: 300 },
                visible: false,
            }
        ],
        city: "",
        windowState: "floating",
        numCols: 1,
    };
}

const store = new Vuex.Store({
    state: {
        fileTree: undefined,
        workingDirectory: undefined,
        config: getDefaultConfig,
    },
    mutations: {
        CONFIGURATION(state, payload) {
            state.config = payload;
            localStorage.setItem("config", JSON.stringify(state.config));
        },
        WINDOW_STATE(state, payload) {
            state.config.windowState = payload;
            localStorage.setItem("config", JSON.stringify(state.config));

        },
        CITY(state, payload) {
            state.config.city = payload;
            localStorage.setItem("config", JSON.stringify(state.config));
        },
        FILE_TREE(state, payload) {
            state.fileTree = payload;
            localStorage.setItem("root", JSON.stringify(payload.getRoot().toJSON()));
        },
        WORKING_DIRECTORY(state, payload) {
            state.workingDirectory = payload;
        }
    },
    actions: {
        loadConfig({ commit }) {
            console.log('loading config')
            let config;
            try {
                config = JSON.parse(window.localStorage.getItem("config"));
                console.log('loaded config')
            } catch (e) {
                console.log('invalid config, loading default');
            }

            if (!config) {
                config = getDefaultConfig();
            };
            commit('CONFIGURATION', config);
        },
        loadFileTree({ commit }) {
            console.log('loading file system')
            let json_obj = JSON.parse(window.localStorage.getItem("root"));
            let tree = new FileSystem(json_obj);
            commit('FILE_TREE', tree);
            commit('WORKING_DIRECTORY', tree.getRoot());
        },
        updateConfig({ commit }, config) {
            commit('CONFIGURATION', config);
        },
        updateFileTree({ commit }, fileTree) {
            commit('FILE_TREE', fileTree);
        },
        updateWorkingDirectory({ commit }, wd) {
            commit('WORKING_DIRECTORY', wd);
        },
        setCity({ commit }, city) {
            commit('CITY', city);
        },
        setState({ commit }, windowState) {
            commit('WINDOW_STATE', windowState);
        },
    },
    getters: {},
});

export default store;
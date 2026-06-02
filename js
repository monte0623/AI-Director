/* ===================================
AI Director State Manager
V10.0B-R1
=================================== */

const AppState = {

    /* ==========================
       Router
    ========================== */

    currentView: "projects",

    /* ==========================
       Project
    ========================== */

    projects: [],

    currentProject: null,

    /* ==========================
       Scene
    ========================== */

    currentScene: null,

    /* ==========================
       Shot
    ========================== */

    currentShot: null,

    /* ==========================
       Mobile
    ========================== */

    mobilePage: "script",

    /* ==========================
       UI
    ========================== */

    isMobile:
        window.innerWidth <= 1000

};

/* ===================================
Helpers
=================================== */

function setCurrentProject(project){

    AppState.currentProject = project;

    AppState.currentScene = null;

    AppState.currentShot = null;

}

function setCurrentScene(scene){

    AppState.currentScene = scene;

    AppState.currentShot = null;

}

function setCurrentShot(shot){

    AppState.currentShot = shot;

}

function setMobilePage(page){

    AppState.mobilePage = page;

}

function isProjectOpen(){

    return AppState.currentProject !== null;

}

function getCurrentProject(){

    return AppState.currentProject;

}

function getCurrentScene(){

    return AppState.currentScene;

}

function getCurrentShot(){

    return AppState.currentShot;

}

/* ===================================＝
Window Resize
=================================== */

window.addEventListener(
    "resize",
    ()=>{
        AppState.isMobile =
        window.innerWidth <= 1000;
    }
);
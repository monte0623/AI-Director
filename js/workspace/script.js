/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-5
Release-001

File:
js/workspace/script.js

Architecture:
Script Workspace

Depends:
event-bus.js
project-store.js
workspace-state.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.WorkspaceUI){
        global.AIDirector.WorkspaceUI = {};
    }

    class ScriptWorkspace {

        constructor(){

            this.container = null;

            this.project = null;

            this.script = {

                title : "",
                content : "",
                version : 1
            };
        }

        //--------------------------------
        // Initialize
        //--------------------------------

        initialize(container){

            this.container = container;

            this.project =
                global
                    .AIDirector
                    .ProjectStore
                    .getProject();

            this.render();

            this.bindEvents();

            this.emit(
                "script.initialized"
            );
        }

        //--------------------------------
        // Render
        //--------------------------------

        render(){

            if(!this.container){
                return;
            }

            this.container.innerHTML = `

            <div class="script-workspace">

                <div class="script-header">

                    <div class="field">

                        <label>
                            Project
                        </label>

                        <input
                            id="script-project-name"
                            type="text"
                            value="${
                                this.project?.metadata
                                    ?.projectName
                                    || ""
                            }">
                    </div>

                    <div class="field">

                        <label>
                            Script Title
                        </label>

                        <input
                            id="script-title"
                            type="text"
                            value="${
                                this.project?.script
                                    ?.title
                                    || ""
                            }">
                    </div>

                </div>

                <div class="script-editor">

                    <label>
                        Script
                    </label>

                    <textarea
                        id="script-content">

${
this.project?.script
    ?.content
    || ""
}

                    </textarea>

                </div>

                <div class="script-toolbar">

                    <button
                        id="script-save">

                        Save
                    </button>

                    <button
                        id="script-breakdown">

                        AI Breakdown
                    </button>

                </div>

            </div>
            `;
        }

        //--------------------------------
        // Save
        //--------------------------------

        save(){

            const title =
                document
                    .getElementById(
                        "script-title"
                    )
                    .value;

            const content =
                document
                    .getElementById(
                        "script-content"
                    )
                    .value;

            if(
                this.project
            ){

                this.project
                    .updateScript({

                        title,

                        content
                    });

                global
                    .AIDirector
                    .ProjectStore
                    .createSnapshot();
            }

            this.emit(
                "script.saved"
            );
        }

        //--------------------------------
        // AI Breakdown
        //--------------------------------

        breakdown(){

            const content =
                document
                    .getElementById(
                        "script-content"
                    )
                    .value;

            this.emit(
                "ai.breakdown.request",
                {
                    content
                }
            );
        }

        //--------------------------------
        // Restore
        //--------------------------------

        restore(){

            this.render();

            this.bindEvents();

            this.emit(
                "script.restored"
            );
        }

        //--------------------------------
        // Bind
        //--------------------------------

        bindEvents(){

            const saveBtn =
                document
                    .getElementById(
                        "script-save"
                    );

            const aiBtn =
                document
                    .getElementById(
                        "script-breakdown"
                    );

            if(saveBtn){

                saveBtn
                    .onclick =
                        ()=>this.save();
            }

            if(aiBtn){

                aiBtn
                    .onclick =
                        ()=>this.breakdown();
            }

            global
                .AIDirector
                .EventBus
                .on(
                    "project.loaded",
                    ()=>{

                        this.project =
                            global
                                .AIDirector
                                .ProjectStore
                                .getProject();

                        this.restore();
                    }
                );
        }

        //--------------------------------
        // Snapshot
        //--------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                script:
                    structuredClone(
                        this.project
                            ?.script
                    )
            };
        }

        //--------------------------------
        // EventBus
        //--------------------------------

        emit(
            namespace,
            payload={}
        ){

            global
                .AIDirector
                .EventBus
                .emit(
                    namespace,
                    payload,
                    "ScriptWorkspace"
                );
        }
    }

    global
        .AIDirector
        .WorkspaceUI
        .Script =
            new ScriptWorkspace();

})(window);

/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-007

File:
js/project-store.js

Architecture:
Hybrid Store
(Map + Order + Relation)

Depends:
event-bus.js
model/project.js
model/scene.js
model/shot.js
model/sequence.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    class ProjectStore {

        constructor(){

            //----------------------------------------
            // Project
            //----------------------------------------

            this.project = null;

            //----------------------------------------
            // Scene Store
            //----------------------------------------

            this.sceneMap =
                new Map();

            this.sceneOrder = [];

            //----------------------------------------
            // Shot Store
            //----------------------------------------

            this.shotMap =
                new Map();

            this.shotOrder = [];

            //----------------------------------------
            // Sequence Store
            //----------------------------------------

            this.sequenceMap =
                new Map();

            this.sequenceOrder = [];

            //----------------------------------------
            // Relations
            //----------------------------------------

            this.sceneShots =
                new Map();

            this.shotScenes =
                new Map();

            this.sequenceShots =
                new Map();

            this.shotSequences =
                new Map();

            //----------------------------------------
            // Snapshot
            //----------------------------------------

            this.snapshots = [];

            //----------------------------------------
            // Subscribe
            //----------------------------------------

            this.bindEvents();
        }

        //------------------------------------------------
        // EventBus
        //------------------------------------------------

        bindEvents(){

            const bus =
                global
                    .AIDirector
                    .EventBus;

            bus.on(
                "scene.linked.shot",
                e =>
                    this.linkSceneShot(
                        e.payload.sceneId,
                        e.payload.shotId
                    )
            );

            bus.on(
                "shot.linked.sequence",
                e =>
                    this.linkShotSequence(
                        e.payload.shotId,
                        e.payload.sequenceId
                    )
            );

            bus.on(
                "sequence.linked.shot",
                e =>
                    this.linkShotSequence(
                        e.payload.shotId,
                        e.payload.sequenceId
                    )
            );
        }

        //------------------------------------------------
        // Project
        //------------------------------------------------

        setProject(
            project
        ){

            this.project =
                project;

            global
                .AIDirector
                .EventBus
                .emit(
                    "project.loaded",
                    {
                        projectId:
                            project.internalId
                    },
                    "ProjectStore"
                );
        }

        getProject(){

            return this.project;
        }

        //------------------------------------------------
        // Scene
        //------------------------------------------------

        createScene(
            scene
        ){

            this.sceneMap.set(
                scene.internalId,
                scene
            );

            this.sceneOrder.push(
                scene.internalId
            );

            global
                .AIDirector
                .EventBus
                .emit(
                    "scene.created",
                    {
                        sceneId:
                            scene.internalId
                    },
                    "ProjectStore"
                );

            return scene;
        }

        getScene(
            sceneId
        ){

            return this
                .sceneMap
                .get(sceneId);
        }

        getAllScenes(){

            return this
                .sceneOrder
                .map(
                    id =>
                        this
                            .sceneMap
                            .get(id)
                );
        }

        deleteScene(
            sceneId
        ){

            this.sceneMap.delete(
                sceneId
            );

            this.sceneOrder =
                this.sceneOrder
                    .filter(
                        id =>
                            id !==
                            sceneId
                    );

            global
                .AIDirector
                .EventBus
                .emit(
                    "scene.deleted",
                    {
                        sceneId
                    },
                    "ProjectStore"
                );
        }

        //------------------------------------------------
        // Shot
        //------------------------------------------------

        createShot(
            shot
        ){

            this.shotMap.set(
                shot.internalId,
                shot
            );

            this.shotOrder.push(
                shot.internalId
            );

            global
                .AIDirector
                .EventBus
                .emit(
                    "shot.created",
                    {
                        shotId:
                            shot.internalId
                    },
                    "ProjectStore"
                );

            return shot;
        }

        getShot(
            shotId
        ){

            return this
                .shotMap
                .get(
                    shotId
                );
        }

        getAllShots(){

            return this
                .shotOrder
                .map(
                    id =>
                        this
                            .shotMap
                            .get(id)
                );
        }

        deleteShot(
            shotId
        ){

            this.shotMap.delete(
                shotId
            );

            this.shotOrder =
                this.shotOrder
                    .filter(
                        id =>
                            id !==
                            shotId
                    );

            global
                .AIDirector
                .EventBus
                .emit(
                    "shot.deleted",
                    {
                        shotId
                    },
                    "ProjectStore"
                );
        }

        //------------------------------------------------
        // Sequence
        //------------------------------------------------

        createSequence(
            sequence
        ){

            this.sequenceMap.set(
                sequence.internalId,
                sequence
            );

            this.sequenceOrder.push(
                sequence.internalId
            );

            global
                .AIDirector
                .EventBus
                .emit(
                    "sequence.created",
                    {
                        sequenceId:
                            sequence.internalId
                    },
                    "ProjectStore"
                );

            return sequence;
        }

        getSequence(
            sequenceId
        ){

            return this
                .sequenceMap
                .get(
                    sequenceId
                );
        }

        getAllSequences(){

            return this
                .sequenceOrder
                .map(
                    id =>
                        this
                            .sequenceMap
                            .get(id)
                );
        }

        deleteSequence(
            sequenceId
        ){

            this.sequenceMap.delete(
                sequenceId
            );

            this.sequenceOrder =
                this.sequenceOrder
                    .filter(
                        id =>
                            id !==
                            sequenceId
                    );

            global
                .AIDirector
                .EventBus
                .emit(
                    "sequence.deleted",
                    {
                        sequenceId
                    },
                    "ProjectStore"
                );
        }

        //------------------------------------------------
        // Relations
        //------------------------------------------------

        linkSceneShot(
            sceneId,
            shotId
        ){

            if(
                !this.sceneShots
                    .has(sceneId)
            ){

                this.sceneShots
                    .set(
                        sceneId,
                        []
                    );
            }

            if(
                !this.shotScenes
                    .has(shotId)
            ){

                this.shotScenes
                    .set(
                        shotId,
                        []
                    );
            }

            const sceneShots =
                this.sceneShots
                    .get(sceneId);

            const shotScenes =
                this.shotScenes
                    .get(shotId);

            if(
                !sceneShots
                    .includes(
                        shotId
                    )
            ){

                sceneShots
                    .push(
                        shotId
                    );
            }

            if(
                !shotScenes
                    .includes(
                        sceneId
                    )
            ){

                shotScenes
                    .push(
                        sceneId
                    );
            }
        }

        linkShotSequence(
            shotId,
            sequenceId
        ){

            if(
                !this.sequenceShots
                    .has(
                        sequenceId
                    )
            ){

                this.sequenceShots
                    .set(
                        sequenceId,
                        []
                    );
            }

            if(
                !this.shotSequences
                    .has(
                        shotId
                    )
            ){

                this.shotSequences
                    .set(
                        shotId,
                        []
                    );
            }

            const seqShots =
                this.sequenceShots
                    .get(
                        sequenceId
                    );

            const shotSeqs =
                this.shotSequences
                    .get(
                        shotId
                    );

            if(
                !seqShots
                    .includes(
                        shotId
                    )
            ){

                seqShots
                    .push(
                        shotId
                    );
            }

            if(
                !shotSeqs
                    .includes(
                        sequenceId
                    )
            ){

                shotSeqs
                    .push(
                        sequenceId
                    );
            }
        }

        //------------------------------------------------
        // Snapshot
        //------------------------------------------------

        createSnapshot(){

            const snapshot = {

                timestamp:
                    Date.now(),

                sceneMap:
                    structuredClone(
                        [...this.sceneMap]
                    ),

                shotMap:
                    structuredClone(
                        [...this.shotMap]
                    ),

                sequenceMap:
                    structuredClone(
                        [...this.sequenceMap]
                    ),

                sceneOrder:
                    [...this.sceneOrder],

                shotOrder:
                    [...this.shotOrder],

                sequenceOrder:
                    [...this.sequenceOrder]
            };

            this.snapshots
                .push(
                    snapshot
                );

            return snapshot;
        }

        //------------------------------------------------
        // Restore
        //------------------------------------------------

        restoreSnapshot(
            snapshot
        ){

            this.sceneMap =
                new Map(
                    snapshot
                        .sceneMap
                );

            this.shotMap =
                new Map(
                    snapshot
                        .shotMap
                );

            this.sequenceMap =
                new Map(
                    snapshot
                        .sequenceMap
                );

            this.sceneOrder =
                [
                    ...snapshot
                        .sceneOrder
                ];

            this.shotOrder =
                [
                    ...snapshot
                        .shotOrder
                ];

            this.sequenceOrder =
                [
                    ...snapshot
                        .sequenceOrder
                ];

            global
                .AIDirector
                .EventBus
                .emit(
                    "project.restored",
                    {},
                    "ProjectStore"
                );
        }

    }

    global
        .AIDirector
        .ProjectStore =
        new ProjectStore();

})(window);

/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-003

File:
js/model/project.js

Architecture:
Project Root Domain

Depends:
domain-base.js
event-bus.js

Status:
Foundation Stable
========================================================
*/

(function (global) {

    "use strict";

    if (!global.AIDirector) {
        global.AIDirector = {};
    }

    if (!global.AIDirector.Model) {
        global.AIDirector.Model = {};
    }

    const DomainObject =
        global.AIDirector
            .Model
            .DomainObject;

    class Project extends DomainObject {

        constructor(
            internalId = "PRJ-" + Date.now(),
            displayId = "PROJECT"
        ) {

            super(
                internalId,
                displayId
            );

            //------------------------------------------------
            // Metadata
            //------------------------------------------------

            this.metadata = {

                projectName: "",

                director: "",

                producer: "",

                dop: "",

                fps: 24,

                resolution: "4K",

                aspectRatio: "16:9",

                colorSpace: "Rec709",

                lut: "",

                platform: "Cinema"
            };

            //------------------------------------------------
            // Script
            //------------------------------------------------

            this.script = {

                scriptId: "",

                title: "",

                content: "",

                version: 1
            };

            //------------------------------------------------
            // Relations
            //------------------------------------------------

            this.scenes = [];

            this.shots = [];

            this.sequences = [];

            this.storyboards = [];

            this.cameras = [];

            this.blockings = [];

            this.shootings = [];

            this.callsheets = [];

            this.reports = [];

            //------------------------------------------------
            // Project State
            //------------------------------------------------

            this.projectStatus =
                "draft";
        }

        //------------------------------------------------
        // Metadata
        //------------------------------------------------

        updateMetadata(
            metadata = {}
        ) {

            this.update({
                metadata: {
                    ...this.metadata,
                    ...metadata
                }
            });

            this.emit(
                "project.updated",
                {
                    type:
                        "metadata"
                }
            );
        }

        //------------------------------------------------
        // Script
        //------------------------------------------------

        updateScript(
            script = {}
        ) {

            this.update({
                script: {
                    ...this.script,
                    ...script
                }
            });

            this.emit(
                "script.updated"
            );
        }

        //------------------------------------------------
        // Scene
        //------------------------------------------------

        addScene(
            sceneId
        ) {

            if (
                !this.scenes.includes(
                    sceneId
                )
            ) {

                this.scenes.push(
                    sceneId
                );

                this.updatedAt =
                    Date.now();

                this.emit(
                    "scene.created",
                    {
                        sceneId
                    }
                );
            }
        }

        removeScene(
            sceneId
        ) {

            this.scenes =
                this.scenes.filter(
                    id =>
                        id !==
                        sceneId
                );

            this.updatedAt =
                Date.now();

            this.emit(
                "scene.deleted",
                {
                    sceneId
                }
            );
        }

        //------------------------------------------------
        // Shot
        //------------------------------------------------

        addShot(
            shotId
        ) {

            if (
                !this.shots.includes(
                    shotId
                )
            ) {

                this.shots.push(
                    shotId
                );

                this.updatedAt =
                    Date.now();

                this.emit(
                    "shot.created",
                    {
                        shotId
                    }
                );
            }
        }

        removeShot(
            shotId
        ) {

            this.shots =
                this.shots.filter(
                    id =>
                        id !==
                        shotId
                );

            this.updatedAt =
                Date.now();

            this.emit(
                "shot.deleted",
                {
                    shotId
                }
            );
        }

        //------------------------------------------------
        // Sequence
        //------------------------------------------------

        addSequence(
            sequenceId
        ) {

            if (
                !this.sequences
                    .includes(
                        sequenceId
                    )
            ) {

                this.sequences
                    .push(
                        sequenceId
                    );

                this.updatedAt =
                    Date.now();

                this.emit(
                    "sequence.created",
                    {
                        sequenceId
                    }
                );
            }
        }

        removeSequence(
            sequenceId
        ) {

            this.sequences =
                this.sequences
                    .filter(
                        id =>
                            id !==
                            sequenceId
                    );

            this.updatedAt =
                Date.now();

            this.emit(
                "sequence.deleted",
                {
                    sequenceId
                }
            );
        }

        //------------------------------------------------
        // Storyboard
        //------------------------------------------------

        addStoryboard(
            storyboardId
        ) {

            if (
                !this.storyboards
                    .includes(
                        storyboardId
                    )
            ) {

                this.storyboards
                    .push(
                        storyboardId
                    );

                this.emit(
                    "storyboard.created",
                    {
                        storyboardId
                    }
                );
            }
        }

        //------------------------------------------------
        // Camera
        //------------------------------------------------

        addCamera(
            cameraId
        ) {

            if (
                !this.cameras
                    .includes(
                        cameraId
                    )
            ) {

                this.cameras
                    .push(
                        cameraId
                    );

                this.emit(
                    "camera.created",
                    {
                        cameraId
                    }
                );
            }
        }

        //------------------------------------------------
        // Snapshot
        //------------------------------------------------

        createProjectSnapshot() {

            return this
                .createSnapshot();
        }

        //------------------------------------------------
        // Validation
        //------------------------------------------------

        validate() {

            return (
                this.metadata
                    .projectName
                    .length >= 0
            );
        }

        //------------------------------------------------
        // Serialize
        //------------------------------------------------

        serialize() {

            return {

                ...super
                    .serialize(),

                metadata:
                    structuredClone(
                        this
                            .metadata
                    ),

                script:
                    structuredClone(
                        this
                            .script
                    ),

                scenes:
                    [
                        ...this
                            .scenes
                    ],

                shots:
                    [
                        ...this
                            .shots
                    ],

                sequences:
                    [
                        ...this
                            .sequences
                    ],

                storyboards:
                    [
                        ...this
                            .storyboards
                    ],

                cameras:
                    [
                        ...this
                            .cameras
                    ],

                blockings:
                    [
                        ...this
                            .blockings
                    ],

                shootings:
                    [
                        ...this
                            .shootings
                    ],

                callsheets:
                    [
                        ...this
                            .callsheets
                    ],

                reports:
                    [
                        ...this
                            .reports
                    ]
            };
        }

    }

    global
        .AIDirector
        .Model
        .Project =
        Project;

})(window);

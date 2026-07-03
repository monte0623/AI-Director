/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-002

File:
js/model/domain-base.js

Architecture:
Domain Root Object

Author:
AI Director Foundation

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

    class DomainObject {

        constructor(
            internalId = "",
            displayId = ""
        ) {

            //------------------------------------------------
            // Identity
            //------------------------------------------------

            this.internalId = internalId;

            this.displayId = displayId;

            //------------------------------------------------
            // Version
            //------------------------------------------------

            this.version = 1;

            this.revision = 0;

            //------------------------------------------------
            // Timestamp
            //------------------------------------------------

            this.createdAt =
                Date.now();

            this.updatedAt =
                Date.now();

            this.deletedAt =
                null;

            //------------------------------------------------
            // State
            //------------------------------------------------

            this.isDirty = false;

            this.isDeleted = false;

            this.isLocked = false;

            this.isFrozen = false;

            //------------------------------------------------
            // Relation
            //------------------------------------------------

            this.relations = {};

            //------------------------------------------------
            // Snapshot
            //------------------------------------------------

            this.snapshots = [];

            //------------------------------------------------
            // History
            //------------------------------------------------

            this.history = [];

            //------------------------------------------------
            // Undo / Redo
            //------------------------------------------------

            this.undoStack = [];

            this.redoStack = [];
        }

        //------------------------------------------------
        // Update
        //------------------------------------------------

        update(data = {}) {

            if (this.isFrozen) {
                return false;
            }

            const before =
                this.snapshot();

            Object.assign(
                this,
                data
            );

            this.updatedAt =
                Date.now();

            this.revision++;

            this.isDirty = true;

            const after =
                this.snapshot();

            this.pushHistory(
                "UPDATE",
                before,
                after
            );

            this.emit(
                "domain.updated"
            );

            return true;
        }

        //------------------------------------------------
        // Delete
        //------------------------------------------------

        delete() {

            const before =
                this.snapshot();

            this.isDeleted = true;

            this.deletedAt =
                Date.now();

            const after =
                this.snapshot();

            this.pushHistory(
                "DELETE",
                before,
                after
            );

            this.emit(
                "domain.deleted"
            );
        }

        //------------------------------------------------
        // Restore
        //------------------------------------------------

        restore() {

            this.isDeleted = false;

            this.deletedAt = null;

            this.updatedAt =
                Date.now();

            this.emit(
                "domain.restored"
            );
        }

        //------------------------------------------------
        // Freeze
        //------------------------------------------------

        freeze() {

            this.isFrozen = true;

            this.emit(
                "domain.frozen"
            );
        }

        unfreeze() {

            this.isFrozen = false;

            this.emit(
                "domain.unfrozen"
            );
        }

        //------------------------------------------------
        // Relation
        //------------------------------------------------

        link(
            relation,
            targetId
        ) {

            if (!this.relations[relation]) {
                this.relations[relation] = [];
            }

            if (
                !this.relations[
                    relation
                ].includes(targetId)
            ) {
                this.relations[
                    relation
                ].push(targetId);
            }

            this.updatedAt =
                Date.now();

            this.emit(
                "domain.linked"
            );
        }

        unlink(
            relation,
            targetId
        ) {

            if (
                !this.relations[
                    relation
                ]
            ) {
                return;
            }

            this.relations[
                relation
            ] =
                this.relations[
                    relation
                ].filter(
                    id =>
                        id !==
                        targetId
                );

            this.updatedAt =
                Date.now();

            this.emit(
                "domain.unlinked"
            );
        }

        //------------------------------------------------
        // Snapshot
        //------------------------------------------------

        snapshot() {

            return structuredClone(
                this.serialize()
            );
        }

        createSnapshot() {

            const snap = {

                snapshotId:
                    "SNP-" +
                    Date.now(),

                timestamp:
                    Date.now(),

                data:
                    this.snapshot()
            };

            this.snapshots.push(
                snap
            );

            return snap;
        }

        restoreSnapshot(
            snapshot
        ) {

            Object.assign(
                this,
                structuredClone(
                    snapshot.data
                )
            );

            this.updatedAt =
                Date.now();

            this.emit(
                "domain.snapshot.restored"
            );
        }

        //------------------------------------------------
        // Diff
        //------------------------------------------------

        diff(other) {

            const changes = {};

            const current =
                this.serialize();

            Object.keys(
                current
            ).forEach(
                key => {

                    const a =
                        JSON.stringify(
                            current[key]
                        );

                    const b =
                        JSON.stringify(
                            other[key]
                        );

                    if (a !== b) {

                        changes[
                            key
                        ] = {

                            before:
                                other[
                                    key
                                ],

                            after:
                                current[
                                    key
                                ]
                        };
                    }
                }
            );

            return changes;
        }

        //------------------------------------------------
        // Clone
        //------------------------------------------------

        clone() {

            return structuredClone(
                this.serialize()
            );
        }

        //------------------------------------------------
        // History
        //------------------------------------------------

        pushHistory(
            type,
            before,
            after
        ) {

            this.history.push({

                type,

                timestamp:
                    Date.now(),

                before,

                after
            });

            this.undoStack.push({

                before,

                after
            });

            this.redoStack = [];
        }

        //------------------------------------------------
        // Undo
        //------------------------------------------------

        undo() {

            const step =
                this.undoStack.pop();

            if (!step) {
                return;
            }

            this.redoStack.push(
                step
            );

            Object.assign(
                this,
                structuredClone(
                    step.before
                )
            );

            this.emit(
                "domain.undo"
            );
        }

        //------------------------------------------------
        // Redo
        //------------------------------------------------

        redo() {

            const step =
                this.redoStack.pop();

            if (!step) {
                return;
            }

            this.undoStack.push(
                step
            );

            Object.assign(
                this,
                structuredClone(
                    step.after
                )
            );

            this.emit(
                "domain.redo"
            );
        }

        //------------------------------------------------
        // Validation
        //------------------------------------------------

        validate() {

            return true;
        }

        //------------------------------------------------
        // Serialization
        //------------------------------------------------

        serialize() {

            return {

                ...this
            };
        }

        deserialize(
            data
        ) {

            Object.assign(
                this,
                data
            );

            return this;
        }

        //------------------------------------------------
        // EventBus
        //------------------------------------------------

        emit(
            namespace,
            payload = {}
        ) {

            if (
                global.AIDirector &&
                global.AIDirector.EventBus
            ) {

                global
                    .AIDirector
                    .EventBus
                    .emit(
                        namespace,
                        {
                            id:
                                this
                                    .internalId,

                            type:
                                this
                                    .constructor
                                    .name,

                            ...payload
                        },
                        this
                            .constructor
                            .name
                    );
            }
        }
    }

    global
        .AIDirector
        .Model
        .DomainObject =
        DomainObject;

})(window);

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Collider2dComponent, RigidBody2dComponent } from '#src/components/index.js';
import Entity from '#src/Entity.js';
import { RigidBodyUpdate2dSystem } from '#src/systems/index.js';
import * as getBoxMomentOfInertiaModule from '#src/systems/RigidBodyUpdate2dSystem/logic/getBoxMomentOfInertia.js';
import * as getCircleMomentOfInertiaModule from '#src/systems/RigidBodyUpdate2dSystem/logic/getCircleMomentOfInertia.js';

describe('RigidBodyUpdate2dSystem', () => {
  describe('constructor()', () => {
    it('Should instantiate', () => {
      const system = new RigidBodyUpdate2dSystem();
      expect(system).toBeInstanceOf(RigidBodyUpdate2dSystem);
      expect(system.name).toBe('RigidBodyUpdate2dSystem');
      expect(system.type).toBe('physics');
    });
  });

  describe('update()', () => {
    let entity: Entity;
    let system: RigidBodyUpdate2dSystem;

    let getBoxMomentOfInertiaSpy: MockInstance<typeof getBoxMomentOfInertiaModule.default>;
    let getCircleMomentOfInertiaSpy: MockInstance<typeof getCircleMomentOfInertiaModule.default>;

    beforeAll(() => {
      getBoxMomentOfInertiaSpy = vi.spyOn(getBoxMomentOfInertiaModule, 'default');
      getCircleMomentOfInertiaSpy = vi.spyOn(getCircleMomentOfInertiaModule, 'default');
    });

    beforeEach(() => {
      system = new RigidBodyUpdate2dSystem();
      entity = new Entity();
    });

    afterEach(() => {
      getBoxMomentOfInertiaSpy.mockClear();
      getCircleMomentOfInertiaSpy.mockClear();
    });

    afterAll(() => {
      getBoxMomentOfInertiaSpy.mockRestore();
      getCircleMomentOfInertiaSpy.mockRestore();
    });

    describe('When passed entities with required components', () => {
      let rigidBody2dComponent: RigidBody2dComponent;
      let collider2dComponent: Collider2dComponent;

      beforeEach(() => {
        rigidBody2dComponent = new RigidBody2dComponent();
        collider2dComponent = new Collider2dComponent({
          shape: {
            type: 'box',
            width: 1,
            height: 1,
          },
        });
        entity.addComponents([
          rigidBody2dComponent,
          collider2dComponent,
        ]);
      });

      describe('When the entity has a box collider', () => {
        beforeEach(() => {
          collider2dComponent.shape = {
            type: 'box',
            width: 1,
            height: 1,
          };
        });

        it('Should update the rigid body moment of inertia using box formula', () => {
          getBoxMomentOfInertiaSpy.mockReturnValue(42);
          system.update([entity]);
          expect(getBoxMomentOfInertiaSpy).toHaveBeenCalled();
          expect(rigidBody2dComponent.momentOfInertia).toBe(42);
          expect(rigidBody2dComponent.inverseMomentOfInertia).toBe(1 / 42);
        });
      });

      describe('When the entity has a circle collider', () => {
        beforeEach(() => {
          collider2dComponent.shape = {
            type: 'circle',
            radius: 1,
          };
        });

        it('Should update the rigid body moment of inertia using circle formula', () => {
          getCircleMomentOfInertiaSpy.mockReturnValue(24);
          system.update([entity]);
          expect(getCircleMomentOfInertiaSpy).toHaveBeenCalled();
          expect(rigidBody2dComponent.momentOfInertia).toBe(24);
          expect(rigidBody2dComponent.inverseMomentOfInertia).toBe(1 / 24);
        });
      });
    });

    describe('When passed entities without required components', () => {
      it('Should not update the rigid body moment of inertia', () => {
        system.update([entity]);
        expect(getBoxMomentOfInertiaSpy).not.toHaveBeenCalled();
        expect(getCircleMomentOfInertiaSpy).not.toHaveBeenCalled();
      });
    });
  });
});

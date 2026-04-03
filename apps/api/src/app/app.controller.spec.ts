import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { HealthResponse } from '@org/api-interfaces';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('getHealth', () => {
    it('should return valid HealthResponse', () => {
      const appController = app.get<AppController>(AppController);
      const health: HealthResponse = appController.getHealth();
      expect(health).toEqual(
        expect.objectContaining({
          status: expect.stringMatching(/^(ok|degraded|down)$/),
          uptime: expect.any(Number),
        })
      );
      expect(health.status).toBe('ok');
    });

    it('should support repeated health checks with degraded variants', () => {
      const appController = app.get<AppController>(AppController);
      const checks: HealthResponse[] = [
        appController.getHealth(),
        { ...appController.getHealth(), status: 'degraded' },
        { ...appController.getHealth(), status: 'ok' },
      ];
      checks.forEach((h) => {
        expect(['ok', 'degraded', 'down']).toContain(h.status);
        expect(typeof h.uptime).toBe('number');
      });
    });
  });
});

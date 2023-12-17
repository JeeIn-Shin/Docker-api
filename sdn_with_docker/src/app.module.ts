import { Module } from '@nestjs/common';
import { ContainerModule } from './containers/container.module';
import { NetworkModule } from './networks/network.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ContainerModule, NetworkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

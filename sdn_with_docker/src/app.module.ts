import { Module } from '@nestjs/common';
import { ContainerModule } from './containers/container.module';
import { NetworkModule } from './networks/network.module';

@Module({
  imports: [ContainerModule, NetworkModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

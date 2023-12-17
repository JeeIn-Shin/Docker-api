import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContainerService } from './container.service';

@Controller('containers')
export class ContainerController {
  constructor(private readonly containersSerivce: ContainerService) {}

  @Get()
  inquireContainer(): Promise<any[]> {
    return this.containersSerivce.getContainerList();
  }

  @Post('deploy')
  deployContainer(@Body() requestBody: any): Promise<any> {
    const image = requestBody.image;
    const name = requestBody.name;
    const networkId = requestBody.networkId;

    return this.containersSerivce.deployContainer(image, name, networkId);
  }
}

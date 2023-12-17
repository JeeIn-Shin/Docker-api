import { Controller, Get, Body } from '@nestjs/common';
import { NetworkService } from './network.service';
import { ContainerNetworkInfo } from './interface/network.interface';

@Controller('containers')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get()
  async getDockerNetworks(
    @Body() requestBody: { networkId?: string },
  ): Promise<ContainerNetworkInfo[]> {
    return this.networkService.getDockerNetworks(requestBody.networkId);
  }
}

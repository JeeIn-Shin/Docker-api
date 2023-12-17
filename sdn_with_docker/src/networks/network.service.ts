import * as Dockerode from 'dockerode';
import { Injectable } from '@nestjs/common';
import { ContainerNetworkInfo } from './interface/network.interface';

@Injectable()
export class NetworkService {
  private docker: Dockerode;

  constructor() {
    this.docker = new Dockerode({
      host: '192.168.249.128',
      port: 2375,
    });
  }

  async getDockerNetworks(networkId?: string): Promise<ContainerNetworkInfo[]> {
    try {
      let networks = await this.docker.listNetworks();

      if (networkId) {
        networks = networks.filter((network) => network.Id === networkId);
      }

      const response: ContainerNetworkInfo[] = networks.map((network) => {
        const containers = network.Containers
          ? Object.keys(network.Containers)
          : [];

        console.log(network);
        return {
          networkName: network.Name,
          networkID: network.Id,
          subnet: network.IPAM.Config[0]?.Subnet || '',
          containers,
        };
      });

      return response;
    } catch (error) {
      throw new Error('Failed to fetch Docker networks');
    }
  }
}

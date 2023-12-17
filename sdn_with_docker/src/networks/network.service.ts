import * as Dockerode from 'dockerode';
import { Injectable } from '@nestjs/common';
import { ContainerNetworkInfo } from './interface/network.interface';

@Injectable()
export class NetworkService {
  private docker: Dockerode;

  constructor() {
    this.docker = new Dockerode({
      //Docker 호스트의 IP 및 포트를 지정
      // '/var/run/docker.sock' - 테스트용으로 사용
      socketPath: '',
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

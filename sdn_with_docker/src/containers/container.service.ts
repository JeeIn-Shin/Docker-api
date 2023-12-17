import * as Dockerode from 'dockerode';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContainerService {
  private docker: Dockerode;

  constructor() {
    this.docker = new Dockerode({
      host: '192.168.249.128',
      port: 2375,
    });
  }

  async getContainerList(): Promise<any[]> {
    try {
      const containers = await this.docker.listContainers({ all: true });

      const containerDetails = await Promise.all(
        containers.map(async (containerInfo) => {
          const container = this.docker.getContainer(containerInfo.Id);
          const data = await container.inspect();
          const networks = data.NetworkSettings.Networks;
          // 원하는 정보 추출 (IP 주소, 이름, MAC 주소 등)
          class conNetInfo {
            ipAddress: string;
            macAddress: string;
            networkId: string;
          }

          for (const key in networks) {
            if (Object.prototype.hasOwnProperty.call(networks, key)) {
              conNetInfo.prototype.ipAddress = networks[key].IPAddress;
              conNetInfo.prototype.macAddress = networks[key].MacAddress;
              conNetInfo.prototype.networkId = networks[key].NetworkID;
            }
          }

          const containerName = data.Name.replace('/', ''); // 컨테이너 이름 앞의 슬래시 제거

          return {
            containerName: containerName,
            containerIP: conNetInfo.prototype.ipAddress,
            containerMac: conNetInfo.prototype.macAddress,
            networkID: conNetInfo.prototype.networkId,
          };
        }),
      );

      return containerDetails;
    } catch (error) {
      throw new Error(
        `컨테이너 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`,
      );
    }
  }

  async deployContainer(
    image: string,
    containerName: string,
    networkId: string,
  ): Promise<any> {
    try {
      const container = await this.docker.createContainer({
        Image: image,
        name: containerName,
        HostConfig: {
          PortBindings: '8082', //특정 포트번호 설정 임시로 3000으로 설정해둠
          NetworkMode: networkId,
        },
      });

      await container.start(); // 컨테이너 실행

      const data = await container.inspect();

      const containerInfo = {
        containerName: data.Name.replace('/', ''),
        containerIP: data.NetworkSettings.IPAddress,
        containerMac: data.NetworkSettings.MacAddress,
      };

      return containerInfo;
    } catch (error) {
      throw new Error(`컨테이너 배포 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  // 임시로 작성해둠, 실제 사용X
  stopContainer(): any {
    const container = Dockerode.prototype.getContainer('<container_name>');

    container.stop((err, data) => {
      if (err) {
        console.log('container error when stop ' + err);
      } else {
        return data;
      }
    });
  }
}

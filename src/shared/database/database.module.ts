import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Environment } from '@env';

import { SessionEntity } from './entity/session.entity';
import { NodeEntity } from './entity/node.entity';
import { UserStaker } from './entity/user-staker.entity';
import { UserEntity } from './entity/user.entity';
import { InfoEntity } from './entity/info.entity';

import { NodeService } from './services/node.service';
import { UserStakerService } from './services/user-staker.service';
import { UsersService } from './services/users.service';
import { InfoService } from './services/info.service';
import { SessionService } from './services/session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionEntity,
      NodeEntity,
      UserStaker,
      UserEntity,
      InfoEntity,
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: Environment.MYSQL_HOST,
      port: Environment.MYSQL_PORT,
      username: Environment.MYSQL_USER,
      password: Environment.MYSQL_PASSWORD,
      database: Environment.MYSQL_DATABASE,
      synchronize: Environment.NODE_ENV !== 'production',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // logging: true,
    }),
  ],
  providers: [
    NodeService,
    UserStakerService,
    UsersService,
    InfoService,
    SessionService,
  ],
  exports: [
    NodeService,
    UserStakerService,
    UsersService,
    InfoService,
    SessionService,
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';

const routes: Routes = [
  { path: 'auth', module: AuthModule },
  { path: 'users', module: UsersModule },
  { path: 'jobs', module: JobsModule },
];

@Module({
  imports: [RouterModule.register(routes)]
})

export class AppRoutingModule { }
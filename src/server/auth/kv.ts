/**
 * Splikan - S2S (Student-to-Student) peer tutoring made easy!
 * Copyright (C) 2025  Joao Augusto Costa Branco Marado Torres
 * <torres.dev@disroot.org>
 *
 * This file is part of Splikan.
 *
 * Splikan is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * Splikan is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Splikan.  If not, see <https://www.gnu.org/licenses/>.
 */
import type { SecondaryStorage } from "better-auth";
import type { RedisClientType } from "redis";

export class AuthKV implements SecondaryStorage {
  private readonly kv: RedisClientType;

  public constructor(kv: RedisClientType) {
    this.kv = kv;
  }

  public async get(key: string): Promise<string | null> {
    if (!this.kv.isOpen) {
      await this.kv.connect();
    }
    return this.kv.get(key);
  }

  public async set(
    key: string,
    value: string,
    ttl?: number,
  ): Promise<void | null | string> {
    if (!this.kv.isOpen) {
      await this.kv.connect();
    }
    return this.kv.set(key, value, { EX: ttl });
  }

  public async delete(key: string): Promise<void | null | string> {
    if (!this.kv.isOpen) {
      await this.kv.connect();
    }
    return this.kv.del(key);
  }
}

// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_yummy_thunderbolt_ross.sql';
import m0001 from './0001_outgoing_thunderbolts.sql';
import m0002 from './0002_serious_gressill.sql';
import m0003 from './0003_tearful_james_howlett.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003
    }
  }
  
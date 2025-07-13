// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_regular_shatterstar.sql';
import m0001 from './0001_nifty_pestilence.sql';
import m0002 from './0002_adorable_pestilence.sql';
import m0003 from './0003_lying_chameleon.sql';
import m0004 from './0004_old_blockbuster.sql';
import m0005 from './0005_uneven_cassandra_nova.sql';
import m0006 from './0006_mute_banshee.sql';
import m0007 from './0007_glossy_beyonder.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006,
m0007
    }
  }
  
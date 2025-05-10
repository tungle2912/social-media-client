// import React, { useContext } from 'react';

// // eslint-disable-next-line import/no-cycle
// import { AuthContext } from '~/components/layouts/RootLayoutWrapper';
// import { ELocale } from '~/definitions';
// import { switchLocale } from '~/services/modules';
// import { Radio, RadioChangeEvent } from '~/theme';

// import styles from './index.module.scss';

// const locales = [ELocale.EN, ELocale.VN];

// export default function LocaleSwitcher() {
//   const { locale } = useContext(AuthContext);

//   const handleSwitchLocale = (e: RadioChangeEvent) => {
//     switchLocale(e?.target?.value);
//   };

//   return (
//     <Radio.Group defaultValue={locale} buttonStyle="solid" className={styles.switcher} onChange={handleSwitchLocale}>
//       {locales.map((lc: ELocale) => (
//         <Radio.Button key={lc} value={lc} className={styles.switcherItem}>
//           {lc.toUpperCase()}
//         </Radio.Button>
//       ))}
//     </Radio.Group>
//   );
// }

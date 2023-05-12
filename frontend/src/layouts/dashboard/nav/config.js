// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'optimize vectors',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  {
    title: 'about the app',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Not found - debug purposes',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;

'use client';

import LanguageSelector from '@/components/Header/LanguageSelector';
import NotificationStrip from '@/components/Header/NotificationStrip';
import type { CommonLayoutQuery } from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { buildUrl } from '@/utils/globalPageProps';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Menu = {
  id: string;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  data: CommonLayoutQuery;
};

const ChevronIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 15 14"
    className="mt-0.5 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
      fill="currentColor"
    />
  </svg>
);

const Header = ({ globalPageProps, data }: Props) => {
  const menuData: Menu[] = [];

  data.layout?.menu.map((item) => {
    if (item.__typename === 'MenuDropdownRecord') {
      const dropdownItem = item;
      menuData.push({
        id: dropdownItem.id,
        title: dropdownItem.title || 'Other Items',
        newTab: false,
        submenu: dropdownItem.items.map((item) => {
          return {
            id: item.id,
            title: item.title,
            path: `/${item.page.slug}`,
            newTab: true,
          };
        }),
      });
    } else {
      const menuItem = item;
      menuData.push({
        id: menuItem.id,
        title: menuItem.title,
        path: `/${menuItem.page.slug}`,
        newTab: false,
      });
    }
  });

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [notificationStrip, setNotificationStrip] = useState(
    !isEmptyDocument(data.layout?.notification),
  );
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const closeMobileNav = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  };

  useEffect(() => {
    const handleStickyNavbar = () => setSticky(window.scrollY >= 80);
    handleStickyNavbar();
    window.addEventListener('scroll', handleStickyNavbar, { passive: true });
    return () => window.removeEventListener('scroll', handleStickyNavbar);
  }, []);

  const linkClass =
    'text-sm font-medium text-black transition-colors hover:text-primary';

  return (
    <>
      {notificationStrip && (
        <NotificationStrip
          notification={data.layout?.notification}
          globalPageProps={globalPageProps}
          setNotificationStrip={setNotificationStrip}
        />
      )}
      <header
        className={`header left-0 z-40 w-full border-b border-border bg-white transition-shadow duration-300 ${
          sticky
            ? 'fixed top-0 z-50 shadow-sm'
            : `absolute ${notificationStrip ? 'top-10' : 'top-0'}`
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href={buildUrl(globalPageProps)}
              className="header-logo flex shrink-0 items-center"
              aria-label="Home"
            >
              {data.layout?.logo.url && (
                <Image
                  src={data.layout.logo.url}
                  alt="logo"
                  width={140}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              )}
            </Link>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
              {menuData.map((menuItem, index) => (
                <div key={menuItem.id} className="group relative">
                  {menuItem.path ? (
                    <Link
                      href={buildUrl(globalPageProps, menuItem.path)}
                      className={linkClass}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSubmenu(index)}
                        aria-expanded={openIndex === index}
                        className={`flex items-center gap-1 py-5 ${linkClass}`}
                      >
                        {menuItem.title}
                        <ChevronIcon />
                      </button>
                      <div
                        className={`absolute left-0 top-full z-10 w-56 rounded border border-border bg-white py-2 shadow-md transition-all duration-200 group-hover:visible group-hover:opacity-100 ${
                          openIndex === index
                            ? 'visible opacity-100'
                            : 'invisible opacity-0'
                        }`}
                      >
                        {menuItem.submenu?.map((submenuItem) => (
                          <Link
                            href={buildUrl(globalPageProps, submenuItem.path)}
                            key={submenuItem.id}
                            className="block px-4 py-2.5 text-sm text-black transition-colors hover:text-primary"
                          >
                            {submenuItem.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSelector
                globalPageProps={globalPageProps}
                languages={data._site.locales}
              />
              <button
                type="button"
                onClick={navbarToggleHandler}
                aria-label="Toggle menu"
                aria-expanded={navbarOpen}
                className="flex flex-col gap-1.5 rounded p-1 ring-primary focus:outline-none focus-visible:ring-2 lg:hidden"
              >
                <span
                  className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                    navbarOpen ? 'translate-y-2 rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                    navbarOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                    navbarOpen ? '-translate-y-2 -rotate-45' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {navbarOpen && (
            <nav
              className="border-t border-border py-4 lg:hidden"
              aria-label="Mobile"
            >
              {menuData.map((menuItem, index) => (
                <div key={menuItem.id}>
                  {menuItem.path ? (
                    <Link
                      href={buildUrl(globalPageProps, menuItem.path)}
                      className="block py-2.5 text-sm font-medium text-black hover:text-primary"
                      onClick={closeMobileNav}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSubmenu(index)}
                        aria-expanded={openIndex === index}
                        className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-black"
                      >
                        {menuItem.title}
                        <ChevronIcon />
                      </button>
                      {openIndex === index && menuItem.submenu && (
                        <div className="pl-4">
                          {menuItem.submenu.map((submenuItem) => (
                            <Link
                              href={buildUrl(globalPageProps, submenuItem.path)}
                              key={submenuItem.id}
                              className="block py-2 text-sm text-body-color hover:text-primary"
                              onClick={closeMobileNav}
                            >
                              {submenuItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

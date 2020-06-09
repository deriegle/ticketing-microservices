import { CurrentUserData } from "../pages/_app";
import Link from "next/link";

export const Header = ({ currentUser }: { currentUser: CurrentUserData }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ].filter(Boolean);

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href={"/"}>
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map((linkConfig) => {
            return (
              <li key={linkConfig.href} className="nav-item">
                <Link href={linkConfig.href}>
                  <a className="nav-link">{linkConfig.label}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

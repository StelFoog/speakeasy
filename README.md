# Speakeasy

This is a webapp to be used by the staff of a (theoretical) speakeasy. It will track their work, what members there are, if they are in the speakeasy at the moment and their open tabs. 

It is implemented in Next.js, uses thecocktaildb as a database for drinks and has mongodb as a database for staff and member data.

## Deployment

The app is currently deployed at [https://speakeasy-ten.vercel.app](https://speakeasy-ten.vercel.app).

## Running locally

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the deployment.

## Structure

- `/components/` contains reusable components and components that are used globally. As an example `/components/SideBar.js` is used only once, but it is used in the `/pages/_app.js` file that renders on every page.

- `/pages/` contains the pages that will be rendered. This is done by next so every file corresponds to a page (or a set of pages).

- `/pages/api/` contains the api-endpoints used to communicate with the database

- `/public/` contains files that are directly made available on deployment without alteration. Mostly images.

- `/redux/` contains files used for global state management

- `/styles/` contains stylesheets. Almost all files are css modules that are scoped to components.

- `/util/` contains files with functionallity used in other files.

Any non-reusable components or functions will be kept in the same file as the component or function they're used in to improve readability and as can be seen in Next.js' own examples of implementations[^1][^2][^3].

### MVP (Model-View-Presenter) Pattern

The model is represented by redux, each page is a presenter that gets and generates data and functions which it feeds to a view declared in the same file, unless the view is used by multiple pages.

## Work

Work is done on a new branch for each feature/fix. `dev` is the main working branch while `master` is production branch with continous deployment. Any new feature should be made on a branch named according to the issue it's based on, branched out from `dev`.

### Currently the app has:

- [x] api enpoints for creating and getting data for the staff
- [x] a front page where the staff can sign in
- [x] a global state to track the signed in user (or that the user isn't signed in)
- [x] a sidebar for navigation
- [x] a ruidmentary search function to search for drinks from thecocktaildb api

### The app will have:

- [ ] A fully implemented drinks search
- [ ] api endpoints for getting and managing members
- [ ] api endpoints for managing members' tabs
- [ ] blocking so that only signed in users can access pages
- [ ] staff can make and check reports (e.g. hours worked)
- [ ] managers can manage and see staff data

## Footnotes

[^1]: [https://github.com/vercel/next.js/tree/canary/examples/auth0](https://github.com/vercel/next.js/tree/canary/examples/auth0)
[^2]: [https://github.com/vercel/next.js/tree/canary/examples/with-webassembly](https://github.com/vercel/next.js/tree/canary/examples/with-webassembly)
[^3]: [https://github.com/vercel/next.js/tree/canary/examples/redirects](https://github.com/vercel/next.js/tree/canary/examples/redirects)


import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { ModalProvider, useModal } from '~/Context/Modal';
import { AlertProvider, useAlert } from '~/Context/Alert';
import { UserProvider } from '~/Context/User';
import Modal from '~/components/Modal';
import Alert from '~/components/Alert';

function App() {
    const { isModalOpen, modalData, closeModal } = useModal();
    const { isAlertOpen, AlertData, closeAlert } = useAlert();
    const routes = [...publicRoutes, ...privateRoutes];

    const renderRoutes = (routes) =>
        routes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            // Xử lý layout
            if (route.layout === null) {
                Layout = Fragment;
            } else if (route.layout) {
                Layout = route.layout;
            }

            return (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <Layout>
                            <Page />
                        </Layout>
                    }
                >
                    {route.children && renderRoutes(route.children)}
                </Route>
            );
        });

    return (
        <Router>
            <div className="App">
                {isModalOpen && <Modal>{React.cloneElement(modalData, { closeModal })}</Modal>}
                {isAlertOpen && <Alert>{React.cloneElement(AlertData, { closeAlert })}</Alert>}

                <Routes>{renderRoutes(routes)}</Routes>
            </div>
        </Router>
    );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
    <ModalProvider>
        <AlertProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </AlertProvider>
    </ModalProvider>
);

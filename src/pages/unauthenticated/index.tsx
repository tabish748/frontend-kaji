import React from 'react';
import styles from '../../styles/pages/404.module.scss'
import Button from '@/components/button/button';
export default function UnauthenticatedLayout() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>You are Unauthorized to access this Route</h1>
            {/* <p className={styles.description}>The content you are looking for might have been moved or does not exist.</p> */}

            <Button
                text={'Go to Home '}
                type="primary"
                size="small"
                fullWidth={true}
                htmlType="submit"
                className={styles.hoePageBtn}
                href="/employees"
            />
        </div>
    );
}

package net.yagom.config;


import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.Properties;

@Configuration
@EnableJpaRepositories(basePackages = "net.yagom.repository")
@EnableTransactionManagement
@PropertySources({
        @PropertySource("classpath:database.properties"),
        @PropertySource(value = "file:/home/ec2-user/database.properties", ignoreResourceNotFound = true)
})
public class DataSourceConfig {

    @Autowired
    private Environment environment;

    public DataSource initDataSource() {
        DataSource dataSource = new DataSource();
        dataSource.setDriverClassName(environment.getProperty("spring.datasource.driverClassName"));
        dataSource.setUrl(environment.getProperty("spring.datasource.url"));
        dataSource.setUsername(environment.getProperty("spring.datasource.username"));
        dataSource.setPassword(environment.getProperty("spring.datasource.password"));
        dataSource.setValidationQuery(environment.getProperty("spring.datasource.validationQuery"));
        dataSource.setInitSQL(environment.getProperty("spring.datasource.connectionInitSql"));

        dataSource.setValidationInterval(30000);
        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(true);

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("net.yagom.domain");
        factory.setDataSource(new LazyConnectionDataSourceProxy(initDataSource()));
        factory.setJpaProperties(JpaProperties());
        factory.afterPropertiesSet();

        return factory;
    }

    private Properties JpaProperties() {
        return new Properties() {
            {
                setProperty("hibernate.dialect", environment.getProperty("hibernate.dialect"));
                setProperty("hibernate.show_sql", environment.getProperty("hibernate.show_sql"));
                setProperty("hibernate.format", environment.getProperty("hibernate.format"));
                setProperty("hibernate.hbm2ddl.auto", environment.getProperty("hibernate.hbm2ddl.auto"));
                setProperty("jadira.usertype.databaseZone", "Asia/Seoul");
                setProperty("jadira.usertype.javaZone", "Asia/Seoul");
            }
        };
    }
}
